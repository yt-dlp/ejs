import { type Variant } from "./tests.ts";

export const prefix = import.meta.dir + "/players";

export function getCachePath(player: string, variant: Variant) {
  return `${prefix}/${player}-${variant}`;
}
