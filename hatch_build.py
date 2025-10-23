import os
import shutil
import subprocess

from hatchling.builders.hooks.plugin.interface import BuildHookInterface


class CustomBuildHook(BuildHookInterface):
    def initialize(self, version, build_data):
        if shutil.which("deno"):
            print("Building with deno...", flush=True)
            os.environ["DENO_NO_UPDATE_CHECK"] = "1"
            subprocess.run(["deno", "install"], check=True)
            subprocess.run(["deno", "task", "bundle"], check=True)

        elif shutil.which("bun"):
            print("Building with bun...", flush=True)
            subprocess.run(["bun", "install"], check=True)
            subprocess.run(["bun", "--bun", "run", "bundle"], check=True)

        elif shutil.which("npm"):
            print("Building with npm...", flush=True)
            # npm is a batch file (`npm.cmd`) on windows, which requires `shell=True`
            requires_shell = os.name == "nt"
            subprocess.run(["npm", "install"], check=True, shell=requires_shell)
            subprocess.run(["npm", "run", "bundle"], check=True, shell=requires_shell)

        else:
            raise RuntimeError(
                "One of 'deno', 'bun', or 'npm' could not be found. "
                "Please install one of them to proceed with the build.")

        build_data["force_include"].update({
            "dist/yt.solver.core.min.js": "yt_dlp_ejs/yt/solver/core.min.js",
            "dist/yt.solver.lib.min.js": "yt_dlp_ejs/yt/solver/lib.min.js",
        })

    def clean(self, versions):
        shutil.rmtree("node_modules", ignore_errors=True)
