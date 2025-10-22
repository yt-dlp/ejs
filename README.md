# yt-dlp-ejs

> [!CAUTION]
> This is currently in development

External JavaScript for yt-dlp supporting many runtimes

## Manual Installation

In the yt-dlp repository, install the python package, either directly or from URL:

```console
pip install git+https://github.com/yt-dlp/ejs@main
```

## Development

While this project does pin its dependencies,
it does not use lockfiles or enforce a particular package manager.
You may install dependencies using any compatible package manager.
If you notice differences between different runtimes' builds
please open an issue [here](<https://github.com/yt-dlp/ejs/issues/new>).

### Build

To build the Python package you need a PEP518 compatible builder.
The build hook will automatically invoke `deno`, `bun` or `node` as required.

Alternatively, to only build the JavaScript files you can run the `bundle` script manually:

```bash
# Deno:
deno install
deno task bundle

# Bun:
bun install
bun --bun run bundle

# Node:
npm install
npm run bundle
```

### Tests

First, make sure the project's dependencies are installed and download the player JS files:

```bash
# Deno:
deno install
deno run src/yt/solver/test/download.ts

# Bun:
bun install
bun run src/yt/solver/test/download.ts

# Node 22.6+:
npm install
node --experimental-strip-types src/yt/solver/test/download.ts
```

Then the tests can be run:

```bash
# Deno
deno test

# Bun
bun test

# Node
node --test
```

## Licensing

This code is licensed under [Unlicense](<https://unlicense.org/>).

An exception to this are the prebuilt wheels, which contain both
[`meriyah`](<https://github.com/meriyah/meriyah>) and [`astring`](<https://github.com/davidbonnet/astring>),
licensed under [`ISC`](<https://github.com/meriyah/meriyah?tab=ISC-1-ov-file>) and [`MIT`](<https://github.com/davidbonnet/astring?tab=MIT-1-ov-file>), respectively.
