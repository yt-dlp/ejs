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
  // Old Deno requires casting to any as globalThis lacks an index signature
  if ((globalThis as any).process?.release?.name === "node") {
    // Assume node compatibility
    const { access, readFile } = await import("node:fs/promises");
    const { deepStrictEqual } = await import("node:assert");
    const assert: Assert = {
      equal: deepStrictEqual,
    };
    let test: Test;
    let writeFile: (
      file: string,
      data: ReadableStream<Uint8Array>,
    ) => Promise<void>;
    if (typeof globalThis.Deno !== "undefined") {
      // Except for Deno, which does its own thing
      writeFile = Deno.writeFile;
      test = (name, func) => {
        Deno.test(name, (t) => {
          return func(assert, async (name, func): Promise<void> => {
            await t.step(name, () => {
              return func(assert);
            });
          });
        });
        return Promise.resolve();
      };
    } else {
      writeFile = (await import("node:fs/promises"))["writeFile"];
      const { suite, test: subtest } = await import("node:test");
      test = (name, func) => {
        suite(name, () => {
          return func(assert, async (name, func): Promise<void> => {
            await subtest(name, async () => {
              await func(assert);
            });
          });
        });
        return Promise.resolve();
      };
    }
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
      test,
    };
  }
  throw new Error(
    `unsupported runtime for testing${
      navigator.userAgent ? `: ${navigator.userAgent}` : ""
    }`,
  );
}
