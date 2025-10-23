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
    if ("anykey" in structure && Array.isArray(structure.anykey)) {
      // Handle `{ anykey: [a, b] }`
      const haystack = Array.isArray(obj) ? obj : Object.values(obj);
      return structure.anykey.every((value) =>
        haystack.some((el) => matchesStructure(el, value)),
      );
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
