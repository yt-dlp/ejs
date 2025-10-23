import { executeSolver, getFromPrepared, preprocessPlayer } from "./solvers.ts";
import { players, tests } from "./test/tests.ts";
import { getCachePath } from "./test/utils.ts";
import { getIO } from "./test/io.ts";

const io = await getIO();

for (const test of tests) {
  for (const variant of test.variants ?? players.keys()) {
    const path = getCachePath(test.player, variant);
    await io.test(`${test.player} ${variant}`, async (assert, subtest) => {
      const content = await io.read(path);
      const solvers = getFromPrepared(preprocessPlayer(content));
      for (const mode of ["n", "sig"] as const) {
        for (const step of test[mode] || []) {
          await subtest(`${step.input} (${mode})`, () => {
            const result = executeSolver(solvers, mode, step.input);
            // const got = solvers[mode]?.(step.input);
            assert.equal(result, step.expected);
          });
        }
      }
    });
  }
}
