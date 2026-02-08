import { players, tests } from "./tests.ts";
import { downloadCached } from "./utils.ts";

for (const test of tests) {
  const variants = test.variants ?? players.keys();
  for (const variant of variants) {
    await downloadCached(test.player, variant);
  }
}
