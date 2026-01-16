import { type Variant } from "./tests.ts";

export const prefix = "src/yt/solver/test/players";

export function getCachePath(player: string, variant: Variant) {
  return `${prefix}/${player}-${variant}`;
}
