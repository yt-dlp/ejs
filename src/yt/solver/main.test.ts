import { preprocessPlayer, type Challenge } from "./solvers.ts";
import { players, tests } from "./test/tests.ts";
import { getCachePath } from "./test/utils.ts";

import { readFile } from "node:fs/promises";
import { test } from "node:test";
import Assert from "node:assert";
import Main from "./main.ts";

const modes = ["n", "sig"] as const;

// @TODO more correct check instead of flat check
test(
  `Does function return correct value?`,
  { timeout: 120 * 1000 },
  async () => {
    for (const testSet of tests) {
      for (const variant of testSet.variants ?? players.keys()) {
        // Same code from solvers.test.ts
        const path = getCachePath(testSet.player, variant);
        const rawCode = await readFile(path, { encoding: "utf-8" });
        const preparedCode = preprocessPlayer(rawCode);

        const challenges: Challenge[] = [];
        const expected: string[] = [];
        for (const mode of modes) {
          for (const step of testSet[mode] ?? []) {
            challenges.push({
              type: mode,
              challenge: step.input,
            });
            expected.push(step.expected);
          }
        }

        const nSet = {
          type: "n" as const,
          challenges: challenges
            .filter((v) => v.type === "n")
            .map((v) => v.challenge),
        };

        const sigSet = {
          type: "sig" as const,
          challenges: challenges
            .filter((v) => v.type === "sig")
            .map((v) => v.challenge),
        };

        const output = Main({
          type: "preprocessed",
          preprocessed_player: preparedCode,
          requests: [nSet, sigSet],
        });

        if (output.type === "error") {
          Assert.fail(`Main execute failed: ${output.error}`);
        }

        Assert.deepStrictEqual(
          output.responses
            .filter((v) => v.type === "result")
            .flatMap((v) => Object.values(v.data)),
          expected,
          "Result does not match!",
        );
      }
    }
  },
);
