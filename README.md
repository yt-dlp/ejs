# yt-dlp-ejs

External JavaScript for yt-dlp supporting many runtimes

## Manual Installation

Install ejs into the same environment as yt-dlp:

```console
pip install -U yt-dlp-ejs
```

## Runtime requirements

This project supports the following runtimes/engines:

| Runtime / engine   | Required version     |
| ------------------ | -------------------- |
| deno               | `>=2.3`              |
| node               | `>=22`               |
| quickjs            | `>=2023-12-9`        |
| quickjs-ng         | any                  |
| bun _(deprecated)_ | `>=1.2.11, <=1.3.14` |

## Development

The project provides lockfiles for every supported package manager.

If you only have Python and a JS runtime, then you may instead run `./hatch_build.py`.
This will transparently invoke one of the supported JS runtimes for the build.

If you notice differences between different runtimes' builds
please open an issue [here](https://github.com/yt-dlp/ejs/issues/new).

### Development requirements

Developers should have the following tools installed:

| Runtime / package manager | Required version                  |
| ------------------------- | --------------------------------- |
| deno                      | `>=2.6`                           |
| node                      | `^24.14.1 \|\| ^25.7.0 \|\| >=26` |
| npm                       | `>=11.10`                         |
| bun                       | `>=1.2.11, <=1.3.14`              |
| pnpm                      | `>=10.16.0`                       |
| quickjs _(optional)_      | `>=2025-4-26`                     |
| quickjs-ng _(optional)_   | `>=0.12.0`                        |

quickjs/quickjs-ng is only needed for yt-dlp integration tests,
which can usually be handled by CI.

### Build

To build the Python package you need a PEP518 compatible builder.
The build hook will automatically invoke `deno`, `bun` or `node` as required.

Alternatively, to only build the JavaScript files you can run the `bundle` script manually:

```bash
python hatch_build.py
```

This will automatically select an available runtime and build using it.

For more fine-grained control over how to build the package, you can set these environment variables:

- `EJS_BUILD_SKIP_INSTALL`: If this environment variable is set, the install step will be skipped.
  It is expected that the required packages are available for the selected bundler.
  No network access should be required if this variable is set.
- `EJS_BUILD_INSTALLER`: Order of installers to try, separated by `:` on POSIX or `;` on Windows.
  These will be used to install the required dependencies for bundling the JavaScript package.
  Can be any of `pnpm`, `deno`, `bun` or `npm` (this is also the default order).
- `EJS_BUILD_BUNDLER`: Order of bundlers to try, separated by `:` on POSIX or `;` on Windows.
  These will be used to perform the bundling of the JavaScript package (calling rollup under the hood).
  Can be any of `esbuild`, `pnpm`, `deno`, `bun`, `node` (this is also the default order).

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
To do this, run the following commands:

```bash
# 1. Upgrade all packages automatically
pnpm upgrade --latest
#    or upgrade only development dependencies
pnpm upgrade --latest --dev
#    or upgrade a specific package, e.g. meriyah
pnpm upgrade --latest meriyah

# 2. Generate base `package-lock.json` with npm
rm -rf node_modules package-lock.json
npm install

# 3. Migrate to other package managers
pnpm import
bun pm migrate --force

# 4. Generate a separate `deno.lock`
deno install --lockfile-only

# 5. Ensure that `deno.lock` is equivalent to `package-lock.json`
python check.py
```

## Licensing

This code is licensed under [Unlicense](https://unlicense.org/).

An exception to this is the prebuilt wheels, which contain both
[`meriyah`](https://github.com/meriyah/meriyah) and [`astring`](https://github.com/davidbonnet/astring),
licensed under [`ISC`](https://github.com/meriyah/meriyah?tab=ISC-1-ov-file) and [`MIT`](https://github.com/davidbonnet/astring?tab=MIT-1-ov-file), respectively.
