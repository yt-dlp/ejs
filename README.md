# yt-dlp-ejs

External JavaScript for yt-dlp supporting many runtimes

## Manual Installation

Install ejs into the same environment as yt-dlp:

```console
pip install -U yt-dlp-ejs
```

## Development

The project provides lockfiles for every supported package manager.

If you only have Python and a JS runtime you may instead invoke `./hatch_build.py`,
which will transparently invoke one of the supported JS runtimes and run the build with it.

If you notice differences between different runtimes' builds
please open an issue [here](<https://github.com/yt-dlp/ejs/issues/new>).

### Build

To build the Python package you need a PEP518 compatible builder.
The build hook will automatically invoke `deno`, `bun` or `node` as required.

Alternatively, to only build the JavaScript files you can run the `bundle` script manually:

```bash
python hatch_build.py
```

This will automatically select an available runtime and build using it.

### Tests

First, make sure the project's dependencies are installed and download the player JS files:

```bash
# Deno:
deno install --frozen
deno run src/yt/solver/test/download.ts

# Bun:
bun install --frozen-lockfile
bun --bun run src/yt/solver/test/download.ts

# Node 22.6+:
npm ci
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

## Upgrading packages

When upgrading packages in package.json, all lockfiles must be updated simultaneously.
To do this, run the follosing commands:
```bash
# Upgrade packages automatically (or manually adjust versions)
pnpm upgrade --latest

# Generate base `package-lock.json`
rm -rf node_modules
npm install

# Migrate to other package managers
pnpm import
bun pm migrate --force

# Make sure to use a deno with lockfile v4 (<2.3)
deno install
# Ensure that `deno.json` is the same as `package-lock.json`
python check.py
```

## Licensing

This code is licensed under [Unlicense](<https://unlicense.org/>).

An exception to this is the prebuilt wheels, which contain both
[`meriyah`](<https://github.com/meriyah/meriyah>) and [`astring`](<https://github.com/davidbonnet/astring>),
licensed under [`ISC`](<https://github.com/meriyah/meriyah?tab=ISC-1-ov-file>) and [`MIT`](<https://github.com/davidbonnet/astring?tab=MIT-1-ov-file>), respectively.
