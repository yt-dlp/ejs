#!/usr/bin/env python
import os
import shutil
import subprocess

try:
    from hatchling.builders.hooks.plugin.interface import BuildHookInterface
except ImportError:
    BuildHookInterface = object


class CustomBuildHook(BuildHookInterface):
    def initialize(self, version, build_data):
        name, cmds, env = build_bundle_cmds()
        if cmds is None:
            raise RuntimeError(
                "One of 'pnpm', 'deno', 'bun', or 'npm' could not be found. "
                "Please install one of them to proceed with the build."
            )
        print(f"Building with {name}...")

        for cmd in cmds:
            subprocess.run(cmd, env=env, check=True)

        build_data["force_include"].update(
            {
                "dist/yt.solver.core.min.js": "yt_dlp_ejs/yt/solver/core.min.js",
                "dist/yt.solver.lib.min.js": "yt_dlp_ejs/yt/solver/lib.min.js",
            }
        )

    def clean(self, versions):
        shutil.rmtree("node_modules", ignore_errors=True)


def build_bundle_cmds():
    env = os.environ.copy()

    if pnpm := shutil.which("pnpm"):
        name = "pnpm"
        install = [pnpm, "install", "--frozen-lockfile"]
        bundle = [pnpm, "run", "bundle"]

    elif deno := shutil.which("deno"):
        name = "deno"
        env["DENO_NO_UPDATE_CHECK"] = "1"
        install = [deno, "install", "--frozen"]
        bundle = [deno, "task", "bundle"]

    elif bun := shutil.which("bun"):
        name = "bun"
        install = ["bun", "install", "--frozen-lockfile"]
        bundle = [bun, "--bun", "run", "bundle"]

    elif npm := shutil.which("npm"):
        name = "npm (node)"
        install = [npm, "ci"]
        bundle = [npm, "run", "bundle"]

    else:
        return None, None, None

    return name, [install, bundle], env


if __name__ == "__main__":
    import sys

    name, cmds, env = build_bundle_cmds()
    if cmds is None:
        print("ERROR: No suitable JavaScript runtime found", file=sys.stderr)
        sys.exit(128)
    print(f"Bundling using {name}...", file=sys.stderr)

    try:
        for cmd in cmds:
            subprocess.check_call(cmd, env=env)
    except subprocess.CalledProcessError as error:
        sys.exit(error.returncode)
