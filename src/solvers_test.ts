import { assertStrictEquals } from "jsr:@std/assert@1";
import { getSolvers } from "./solvers.ts";
import { players, tests } from "../tests/tests.ts";
import { getCachePath } from "../tests/utils.ts";

for (const test of tests) {
  for (const variant of test.variants ?? players.keys()) {
    const path = getCachePath(test.player, variant);
    Deno.test(`${test.player} ${variant}`, async (t) => {
      const content = await Deno.readTextFile(path);
      const solvers = getSolvers(content);
      for (const mode of ["nsig", "sig"] as const) {
        for (const step of test[mode] || []) {
          await t.step(`${step.input} (${mode})`, () => {
            const got = solvers[mode]?.(step.input);
            assertStrictEquals(got, step.expected);
          });
        }
      }
    });
  }
}
