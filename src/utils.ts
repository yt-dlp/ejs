import { parse } from "@babel/parser";
import { type Node, type Statement } from "@babel/types";
import { type DeepPartial } from "./types.ts";

export function matchesStructure<T extends Node>(
  obj: Node | Node[],
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
    for (const [key, value] of Object.entries(structure)) {
      if (!matchesStructure(obj[key as keyof typeof obj], value)) {
        return false;
      }
    }
    return true;
  }
  return structure === obj;
}

export function getFunctionNodes(f: (...a: unknown[]) => void): Statement[] {
  const func = parse(f.toString()).program.body[0];
  if (func.type === "FunctionDeclaration") {
    return func.body.body;
  }
  console.error("failed to parse function into nodes");
  return [];
}

export function isOneOf<T>(value: unknown, ...of: readonly T[]): value is T {
  return of.includes(value as T);
}
