import * as esbuild from "npm:esbuild@0.25.5";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@0.11.1";

await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ["./src/main.ts"],
  outfile: "./dist/jsc-deno.js",
  bundle: true,
  format: "esm",
  sourcemap: false,
});
esbuild.stop();
