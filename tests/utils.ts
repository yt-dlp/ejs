import { type Variant } from "./tests.ts";

export function getCachePath(player: string, variant: Variant) {
    return `tests/players/${player}_${variant}.js`;
}
