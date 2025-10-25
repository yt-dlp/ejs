import { preprocessPlayer, solveAll, type Challenge } from "./solvers.ts";
import { players, tests } from "./test/tests.ts";
import { getCachePath } from "./test/utils.ts";

import { readFile } from "node:fs/promises";
import { test as subtest, suite } from "node:test";
import Assert from "node:assert";

const modes = ["n", "sig"] as const;

// Deno, Node.js, Bun all supports node:test, node:assert
// So why not use node:test?
for (const test of tests) {
  for (const variant of test.variants ?? players.keys()) {
    const path = getCachePath(test.player, variant);
    await suite(`${test.player} ${variant}`, async () => {
      const rawCode = await readFile(path, { encoding: "utf-8" });
      // Make test set / expected
      const challenges: Challenge[] = [];
      const expected: string[] = [];
      for (const mode of modes) {
        for (const step of test[mode] ?? []) {
          challenges.push({
            type: mode,
            challenge: step.input,
          });
          expected.push(step.expected);
        }
      }

      const preparedCode = preprocessPlayer(rawCode);
      // Solve challenges
      const solve = solveAll(preparedCode, challenges);

      for (let i = 0; i < solve.result.length; i++) {
        const challenge = challenges[i];
        const got = solve.result[i];
        await subtest(`${challenge.challenge} (${challenge.type})`, () => {
          Assert.equal(got, expected[i]);
        });
      }
    });
  }
}
