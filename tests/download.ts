import { players, tests } from "./tests.ts";
import { getCachePath } from "./utils.ts";
import { getIO } from "./io.ts";

const io = await getIO();

for (const test of tests) {
  const variants = test.variants ?? players.keys();
  for (const variant of variants) {
    const path = getCachePath(test.player, variant);
    if (await io.exists(path)) {
      continue;
    }
    const playerPath = players.get(variant);
    const url = `https://www.youtube.com/s/player/${test.player}/${playerPath}`;
    console.log("Requesting", url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to request ${variant} player for ${test.player}`);
      continue;
    }
    await io.write(path, response);
  }
}
