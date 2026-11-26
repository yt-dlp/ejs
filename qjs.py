import json
import pathlib
import subprocess
import sys


class FailedTest(Exception):
    pass


tests_path = pathlib.Path("./tests.json")
script_path = pathlib.Path("./qjs-test.js")
core_js_path = pathlib.Path("./dist/yt.solver.core.min.js")
lib_js_path = pathlib.Path("./dist/yt.solver.lib.min.js")

if not tests_path.is_file():
    print(f"{tests_path} not found! generate it with deno/node")
    sys.exit(1)

for js in (core_js_path, lib_js_path):
    if not js.is_file():
        print(f"{js} not found! ejs needs to be bundled")
        sys.exit(1)

core_js = core_js_path.read_text()
lib_js = lib_js_path.read_text()

with tests_path.open("rb") as f:
    tests = json.load(f)

passed = []
failed = {}

for test in tests:
    player = test["player"]

    expected = {
        test[challenge_type][0]["input"]: test[challenge_type][0]["expected"]
        for challenge_type in ("n", "sig")
    }

    challenge_requests = [
        {
            "type": challenge_type,
            "challenges": {
                "player_url": player,
                "challenges": [test[challenge_type][0]["input"]],
            },
        }
        for challenge_type in ("n", "sig")
    ]

    # quickjs is quite slow so only test the yt-dlp default (or first) variant from each test
    variants = test["variants"]
    variant = (
        "tv" if "tv" in variants else "tv_tcl" if "tv_tcl" in variants else variants[0]
    )
    identifier = f"{player}-{variant}"
    padding = " " * (23 - len(identifier))

    data = {
        "type": "player",
        "player": pathlib.Path(
            f"./src/yt/solver/test/players/{identifier}"
        ).read_text(),
        "requests": challenge_requests,
    }
    script_path.write_text(f"""\
        {lib_js}
        function require(name) {{
          const result = (lib?.lib ?? lib)[name];
          if (!result) {{
            throw `Missing library: ${{name}}`;
          }}
          return result;
        }}
        function structuredClone(x) {{ return JSON.parse(JSON.stringify(x)); }}
        {core_js}
        console.log(JSON.stringify(jsc.default({json.dumps(data)})));
        """)

    try:
        try:
            output = json.loads(
                subprocess.check_output(
                    ["qjs", "--script", str(script_path)], text=True
                )
            )
        except (json.JSONDecodeError, subprocess.CalledProcessError) as error:
            if isinstance(error, subprocess.CalledProcessError):
                errnote = error.stderr or str(error.output)
            else:
                errnote = str(error)
            raise FailedTest(errnote)

        if output["type"] == "error":
            raise FailedTest(output["error"])

        responses = output["responses"]
        for response in responses:
            if response["type"] == "error":
                raise FailedTest(response["error"])
            for challenge, result in response["data"].items():
                if result != expected[challenge]:
                    raise FailedTest(f"wrong result: {result}")

        print(f"{identifier}{padding} . . . PASS")
        passed.append(identifier)

    except FailedTest as failure:
        print(f"{identifier}{padding} . . . FAIL")
        failed[identifier] = str(failure)

print(f"tested: {len(passed) + len(failed)}")
print(f"passed: {len(passed)}")
print(f"failed: {len(failed)}")

if failed:
    print(json.dumps(failed, indent=2))
    sys.exit(1)
