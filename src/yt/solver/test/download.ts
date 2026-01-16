import { players, tests } from "./tests.ts";
import { prefix, getCachePath } from "./utils.ts";
import { getIO } from "./io.ts";

const io = await getIO();

async function download(): Promise<Set<string>> {
  const result = new Set<string>();

  for (const test of tests) {
    const variants = test.variants ?? players.keys();
    for (const variant of variants) {
      const path = getCachePath(test.player, variant);
      result.add(path);
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

  return result;
}

let cleanup = false;
for (const arg of await io.args()) {
  if (arg === "--cleanup") {
    cleanup = true;
  } else {
    throw new Error("Invalid argument: " + JSON.stringify(arg));
  }
}

const exist = new Set<string>();
const want = await download();
if (cleanup) {
  want.add(`${prefix}/.gitignore`);
}

for (const path of await io.readdir(prefix)) {
  exist.add(`${prefix}/${path}`);
}

for (const path of exist) {
  if (want.has(path)) {
    continue;
  }
  io.unlink(path);
}
