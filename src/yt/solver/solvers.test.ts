import { getFromPrepared, preprocessPlayer } from "./solvers.ts";
import { getIO } from "./test/io.ts";
import { players, tests } from "./test/tests.ts";
import { getCachePath } from "./test/utils.ts";

const io = await getIO();

for (const test of tests) {
  for (const variant of test.variants ?? players.keys()) {
    const path = getCachePath(test.player, variant);
    await io.test(`-${test.player}-${variant}-`, async (assert, subtest) => {
      const content = await io.read(path);
      const solvers = getFromPrepared(preprocessPlayer(content));
      for (const mode of ["n", "sig"] as const) {
        for (const step of test[mode] || []) {
          await subtest(`${step.input} (${mode})`, () => {
            const got = solvers[mode]?.(
              mode === "sig" ? fromHex(step.input) : step.input,
            );
            assert.equal(
              got && mode === "sig" ? toHex(got) : got,
              step.expected,
            );
          });
        }
      }
    });
  }
}

function toHex(v: string): string {
  const hex = "0123456789ABCDEF";

  let output = "";
  for (let i = 0; i < v.length; i++) {
    const byte = v.charCodeAt(i);
    output += hex[(byte & 0xf0) >> 4] + hex[byte & 0x0f];
  }
  return output;
}

function fromHex(v: string): string {
  const hex = "0123456789ABCDEF";

  v = v.toUpperCase();
  let output = "";
  for (let i = 0; i < v.length; i += 2) {
    const upper = hex.indexOf(v.charAt(i));
    const lower = hex.indexOf(v.charAt(i + 1));
    output += String.fromCharCode((upper << 4) | lower);
  }

  return output;
}
