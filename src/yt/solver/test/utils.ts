import { type Variant } from "./tests.ts";

export function getCachePath(player: string, variant: Variant) {
  return `src/yt/solver/test/players/${player}-${variant}`;
}
