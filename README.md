# yt-dlp-ejs

> [!CAUTION]
> This is currently in development

External JavaScript for yt-dlp supporting many runtimes

## Manual Installation

In the yt-dlp repository, install the python package, either directly or from url:

```console
pip install git+https://github.com/yt-dlp/ejs@main
```

## Development

While this project does pin its dependencies,
it does not use lockfiles or enforce a particular package manager.
You may install dependencies using any compatible package manager.
If you notice differences between different runtimes builds
please open an issue [here](<https://github.com/yt-dlp/ejs/issues/new>).

### Build

To build the Python package you need a PEP518 compatible builder.
The build hook will automatically invoke `deno`, `bun` or `node` as required.

Alternatively, to only build the JavaScript files you can run the `bundle` script manually.

### Tests

First, to download the player files, run `src/yt/solver/test/download.ts`.

After running that once, use any of `deno test`, `bun test` or `node --test`.
