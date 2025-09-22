import { defineConfig } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";
import terser from "@rollup/plugin-terser";

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
    ],
  },
]);
