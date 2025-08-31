type IO = {
  exists(path: string): Promise<boolean>;
  read(path: string): Promise<string>;
  write(path: string, response: Response): Promise<void>;
  test: Test;
};

type Assert = {
  equal<T>(actual: T, expected: T, message?: string): void;
};
type Test = (name: string, func: TestFunc) => Promise<void>;
type TestFunc = (assert: Assert, subtest: Subtest) => Promise<void> | void;
type Subtest = (name: string, func: SubtestFunc) => Promise<void>;
type SubtestFunc = (assert: Assert) => Promise<void> | void;

let io: IO | null = null;

export async function getIO(): Promise<IO> {
  if (io === null) {
    io = await _getIO();
  }
  return io;
}

async function _getIO(): Promise<IO> {
  if (typeof Deno !== "undefined") {
    const { exists } = await import("@std/fs/exists");
    const { assertStrictEquals } = await import("@std/assert");
    const assert = {
      equal<T>(actual: T, expected: T, message?: string) {
        return assertStrictEquals(actual, expected, message);
      },
    };
    return {
      exists,
      read(path: string): Promise<string> {
        return Deno.readTextFile(path);
      },
      async write(path: string, response: Response): Promise<void> {
        const file = await Deno.open(path, {
          createNew: true,
          write: true,
        });
        response.body!.pipeTo(file.writable);
      },
      test(name: string, func: TestFunc) {
        Deno.test(name, (t) => {
          return func(assert, async (name, func): Promise<void> => {
            await t.step(name, () => {
              return func(assert);
            });
          });
        });
        return Promise.resolve();
      },
    };
  } else if (typeof Bun !== "undefined") {
    const { expect, test } = await import("bun:test");
    const { access } = await import("node:fs/promises");
    const assert = {
      equal<T>(actual: T, expected: T, message?: string) {
        return expect(actual).toBe(expected, message);
      },
    };
    return {
      async exists(path: string): Promise<boolean> {
        try {
          await access(path);
          return true;
        } catch {
          return false;
        }
      },
      read(path: string): Promise<string> {
        return Bun.file(path).text();
      },
      write(path: string, response: Response): Promise<void> {
        return Bun.write(path, response);
      },
      test(name: string, func: TestFunc) {
        test(name, () => {
          // XXX: how to do subtests
          return func(assert, async (name, func): Promise<void> => {
            await func(assert);
          });
        });
        return Promise.resolve();
      },
    };
  } else if (
    typeof navigator === "object" &&
    navigator.userAgent.startsWith("Node.js")
  ) {
    const { suite, test } = await import("node:test");
    const { readFile, writeFile, access } = await import("node:fs/promises");
    const { deepStrictEqual } = await import("node:assert");
    const assert: Assert = {
      equal<T>(actual: T, expected: T, message?: string): void {
        deepStrictEqual(actual, expected, message);
      },
    };
    return {
      async exists(path: string): Promise<boolean> {
        try {
          await access(path);
          return true;
        } catch {
          return false;
        }
      },
      read(path: string): Promise<string> {
        return readFile(path, { encoding: "utf-8" });
      },
      write(path: string, response: Response): Promise<void> {
        return writeFile(path, response.body!);
      },
      test(name: string, func: TestFunc): Promise<void> {
        suite(name, () => {
          return func(assert, async (name, func): Promise<void> => {
            await test(name, async () => {
              await func(assert);
            });
          });
        });
        return Promise.resolve();
      },
    };
  }
  throw new Error(
    `unsupported runtime for testing${
      navigator.userAgent ? `: ${navigator.userAgent}` : ""
    }`
  );
}
