import { defineConfig } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";
import terser from "@rollup/plugin-terser";
import { createHash } from "node:crypto";

function printHash() {
  return {
    name: "hash-output-plugin",
    async writeBundle(options, bundle) {
      for (const [fileName, assetInfo] of Object.entries(bundle)) {
          if (assetInfo.code) {
            try {
              const data = Buffer.from(assetInfo.code)
              const hash = createHash("sha3-512").update(data).digest("hex");
              console.log(`SHA3-512 for ${assetInfo.fileName}: ${hash}`);
            } catch (err) {
              console.error(`Error hashing ${fileName}:`, err.message);
            }
          }
      }
    },
  };
}

export default defineConfig([
  {
    input: "src/main.ts",
    output: {
      name: "jsc",
      globals: {
        astring: "astring",
        input: "input",
        meriyah: "meriyah",
      },
      file: "dist/yt.solver.core.js",
      format: "iife",
    },
    external: ["astring", "meriyah"],
    plugins: [
      nodeResolve(),
      sucrase({
        exclude: ["node_modules/**"],
        transforms: ["typescript"],
      }),
      printHash(),
    ],
  },
  {
    input: "src/main.ts",
    output: {
      name: "jsc",
      globals: {
        astring: "astring",
        input: "input",
        meriyah: "meriyah",
      },
      file: "dist/yt.solver.core.min.js",
      compact: true,
      format: "iife",
      minifyInternalExports: true,
    },
    external: ["astring", "meriyah"],
    plugins: [
      nodeResolve(),
      sucrase({
        exclude: ["node_modules/**"],
        transforms: ["typescript"],
      }),
      terser(),
      printHash(),
    ],
  },
  {
    input: "src/lib.ts",
    output: {
      name: "lib",
      file: "dist/yt.solver.lib.js",
      format: "iife",
      exports: "named",
    },
    plugins: [
      nodeResolve(),
      sucrase({
        exclude: ["node_modules/**"],
        transforms: ["typescript"],
      }),
      printHash(),
    ],
  },
  {
    input: "src/lib.ts",
    output: {
      name: "lib",
      file: "dist/yt.solver.lib.min.js",
      compact: true,
      format: "iife",
      minifyInternalExports: true,
    },
    plugins: [
      nodeResolve(),
      sucrase({
        exclude: ["node_modules/**"],
        transforms: ["typescript"],
      }),
      terser(),
      printHash(),
    ],
  },
]);
