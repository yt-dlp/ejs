import { getIO } from "./io.ts";
import { players, type Variant } from "./tests.ts";

export function getCachePath(player: string, variant: Variant) {
  return `src/yt/solver/test/players/${player}-${variant}`;
}

export async function downloadCached(player: string, variant: string) {
  const io = await getIO();

  const playerPath = players.get(variant as Variant);
  if (!playerPath) {
    throw `Invalid player variant: ${variant}`;
  }
  const path = getCachePath(player, variant as Variant);
  if (!(await io.exists(path))) {
    const url = `https://www.youtube.com/s/player/${player}/${playerPath}`;
    console.log("Requesting", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw `Failed to request ${variant} player for ${player}`;
    }
    await io.write(path, response);
  }
  return await io.read(path);
}
