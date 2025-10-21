import { type ESTree } from "meriyah";
import { type DeepPartial } from "./types.ts";

export function matchesStructure<T extends ESTree.Node>(
  obj: ESTree.Node | ESTree.Node[],
  structure: DeepPartial<T> | readonly DeepPartial<T>[],
): boolean {
  if (Array.isArray(structure)) {
    if (!Array.isArray(obj)) {
      return false;
    }
    return (
      structure.length === obj.length &&
      structure.every((value, index) => matchesStructure(obj[index], value))
    );
  }
  if (typeof structure === "object") {
    if (!obj) {
      return !structure;
    }
    if ("or" in structure) {
      // Handle `{ or: [a, b] }`
      return structure.or.some((node) => matchesStructure(obj, node));
    }
    if (Array.isArray(obj)) {
      // Handle `{ some: pattern }`
      if ("some" in structure) {
        const pattern = structure.some as unknown as DeepPartial<T>;
        return obj.some((el) => matchesStructure(el, pattern));
      }
    }
    for (const [key, value] of Object.entries(structure)) {
      if (!matchesStructure(obj[key as keyof typeof obj], value)) {
        return false;
      }
    }
    return true;
  }
  return structure === obj;
}

export function isOneOf<T>(value: unknown, ...of: readonly T[]): value is T {
  return of.includes(value as T);
}
