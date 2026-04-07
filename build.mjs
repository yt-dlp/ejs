import * as esbuild from "esbuild";

const buildConfig = await stdinJSON();
const result = await esbuild.build(buildConfig);
console.log(JSON.stringify(result.metafile ?? null));
await esbuild.stop();

async function stdinJSON() {
  const chunks = [];
  if (globalThis.Deno) {
    for await (const chunk of globalThis.Deno.stdin.readable) {
      chunks.push(chunk);
    }
    const length = chunks.reduce(
      (previous, chunk) => previous + chunk.length,
      0,
    );
    const buffer = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.length;
    }
    return JSON.parse(new TextDecoder().decode(buffer));
  }

  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf-8");
  return JSON.parse(text);
}
