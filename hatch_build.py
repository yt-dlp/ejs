import subprocess
import shutil
import os

from hatchling.builders.hooks.plugin.interface import BuildHookInterface


class CustomBuildHook(BuildHookInterface):
    def initialize(self, version, build_data):
        if shutil.which("deno"):
            print("Building with deno...", flush=True)
            subprocess.run(["deno", "install"], check=True)
            subprocess.run(["deno", "task", "bundle"], check=True)

        elif shutil.which("bun"):
            print("Building with bun...", flush=True)
            subprocess.run(["bun", "install", "--frozen-lockfile"], check=True)
            subprocess.run(["bun", "run", "bundle"], check=True)

        elif shutil.which("npm"):
            print("Building with npm...", flush=True)
            # npm is a batch file (`npm.cmd`) on windows, which requires `shell=True`
            requires_shell = os.name == "nt"
            subprocess.run(["npm", "ci"], check=True, shell=requires_shell)
            subprocess.run(["npm", "run", "bundle"], check=True, shell=requires_shell)
        else:
            raise RuntimeError("Neither 'deno', 'bun', or 'npm' is installed. Please install one of them to proceed with the build.")
        
        build_data["artifacts"].extend([
            "dist/yt.solver.core.js",
            "dist/yt.solver.core.min.js",
            "dist/yt.solver.lib.js",
            "dist/yt.solver.lib.min.js",
            "dist/yt.solver.deno.lib.js",
            "dist/yt.solver.bun.lib.js",
        ])
        build_data["force_include"]["dist/yt.solver.core.min.js"] = "yt_dlp_ejs/yt/solver/core.min.js"
        build_data["force_include"]["dist/yt.solver.lib.min.js"] = "yt_dlp_ejs/yt/solver/lib.min.js"

    def clean(self, versions):
        shutil.rmtree('node_modules', ignore_errors=True)
