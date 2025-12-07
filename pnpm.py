#!/usr/bin/env python
import json
import os
import pathlib
import shutil
import subprocess

try:
    from hatchling.builders.hooks.plugin.interface import BuildHookInterface
except ImportError:
    BuildHookInterface = object


class CustomBuildHook(BuildHookInterface):
    def initialize(self, version, build_data):
        name, pnpm = build_pnpm()
        if pnpm is None:
            raise RuntimeError(
                "One of 'deno', 'bun', or 'npm' could not be found. "
                "Please install one of them to proceed with the build."
            )
        print(f"Building with {name}...")

        pnpm(["install", "--frozen-lockfile"])
        pnpm(["run", "bundle"])

        build_data["force_include"].update(
            {
                "dist/yt.solver.core.min.js": "yt_dlp_ejs/yt/solver/core.min.js",
                "dist/yt.solver.lib.min.js": "yt_dlp_ejs/yt/solver/lib.min.js",
            }
        )

    def clean(self, versions):
        shutil.rmtree("node_modules", ignore_errors=True)


def build_pnpm():
    package_json = pathlib.Path(__file__).with_name("package.json")
    with package_json.open("rb") as file:
        data = json.load(file)

    package_manager = data["packageManager"]
    env = os.environ.copy()

    if pnpm := shutil.which("pnpm"):
        name = "pnpm binary"
        cmd = [pnpm]

    elif deno := shutil.which("deno"):
        name = "deno"
        env["DENO_NO_UPDATE_CHECK"] = "1"
        cmd = [
            deno,
            "run",
            "--allow-all",
            "--node-modules-dir=none",
            f"npm:{package_manager}",
        ]

    elif bun := shutil.which("bun"):
        name = "bun"
        cmd = [bun, "x", package_manager]

    elif npm := shutil.which("npm"):
        name = "npm (node)"
        cmd = [npm, "exec", "--", package_manager]

    else:
        return None, None

    def run_pnpm(args: list[str]):
        return subprocess.check_call([*cmd, *args], env=env)

    return name, run_pnpm


if __name__ == "__main__":
    import sys

    name, pnpm = build_pnpm()
    if pnpm is None:
        print("ERROR: No suitable JavaScript runtime found", file=sys.stderr)
        sys.exit(128)
    print(f"Calling {name}...", file=sys.stderr)

    try:
        pnpm(sys.argv[1:])
    except subprocess.CalledProcessError as error:
        sys.exit(error.returncode)
