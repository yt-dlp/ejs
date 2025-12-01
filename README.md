# yt-dlp-ejs

External JavaScript for yt-dlp supporting many runtimes

## Manual Installation

Install ejs into the same environment as yt-dlp:

```console
pip install -U yt-dlp-ejs
```

## Development

The project uses [`pnpm`](<>) as a package manager with
dependencies pinned through `pnpm-lock.yaml`.

If you only have python and a JS runtime you may instead invoke `./pnpm.py`,
which will transparently invoke the supported JS runtimes to call `pnpm`.

This pure JavaScript approach should be runtime agnostic.
If you notice differences between different runtimes' builds
please open an issue [here](<https://github.com/yt-dlp/ejs/issues/new>).

### Build

To build the Python package you need a PEP518 compatible builder.
The build hook will automatically invoke `deno`, `bun` or `node` as required.

Alternatively, to only build the JavaScript files you can run the `bundle` script manually:

```bash
python pnpm.py install --frozen-lockfile
python pnpm.py run bundle
```

This will automatically select an available runtime and invoke `pnpm` to build it.

### Tests

First, make sure the project's dependencies are installed and download the player JS files:

```bash
# Deno:
python pnpm.py install --frozen-lockfile
deno run src/yt/solver/test/download.ts

# Bun:
python pnpm.py install --frozen-lockfile
bun --bun run src/yt/solver/test/download.ts

# Node 22.6+:
python pnpm.py install --frozen-lockfile
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
