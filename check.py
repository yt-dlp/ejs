#!/usr/bin/env python
from __future__ import annotations

import json
import pathlib
import sys

ADDITIONAL_PACKAGES_NODE = {}
ADDITIONAL_PACKAGES_DENO = {
    "@types/node@22.5.4": "sha512-FDuKUJQm/ju9fT/SeX/6+gBzoPzlVCzfzmGkwKvRHQVxi4BntVbyIwf6a4Xn62mrvndLiml6z/UBXIdEVjQLXg==",
    "undici-types@6.19.8": "sha512-ve2KP6f/JnbPBFyobGHuerC9g1FYGn/F8n1LWTwNxCEzd6IfqTwUQcNXgEtmmQ6DlRrC1hrSrBnCZPokRrDHjw==",
}
BASE_PATH = pathlib.Path(__file__).parent


def parse_deno() -> dict[str, str]:
    path = BASE_PATH / "deno.lock"
    with path.open("rb") as file:
        lockfile = json.load(file)

    v = lockfile["version"]
    if v not in ("4", "5"):
        msg = f"Unsupported lockfile version: {v} (expected 4/5)"
        raise ValueError(msg)

    integrities = {}
    for name, info in lockfile["npm"].items():
        integrity = info["integrity"]
        other = integrities.get(integrity)
        if other and other != name:
            msg = f"Duplicate integrity for {name} and {other}: {integrity}"
            raise ValueError(msg)

        integrities[integrity] = name

    return integrities


def parse_node() -> dict[str, str]:
    path = BASE_PATH / "package-lock.json"
    with path.open("rb") as file:
        lockfile = json.load(file)

    v = lockfile["lockfileVersion"]
    if v != 3:
        msg = f"Unsupported lockfile version: {v} (expected 3)"
        raise ValueError(msg)

    integrities = {}
    for path, info in lockfile["packages"].items():
        if not path:
            continue

        _, _, mod_name = path.rpartition("node_modules/")
        version = info["version"]
        name = f"{mod_name}@{version}"

        integrity = info["integrity"]
        other = integrities.get(integrity)
        if other and other != name:
            msg = f"Duplicate integrity for {name} and {other}: {integrity}"
            raise ValueError(msg)
        integrities[integrity] = name

    return integrities


def main():
    try:
        packages_deno = parse_deno()
    except Exception as error:
        print(f"ERROR: Could not read deno lockfile: {error}", file=sys.stderr)
        sys.exit(1)

    try:
        packages_node = parse_node()
    except Exception as error:
        print(f"ERROR: Could not read npm lockfile: {error}", file=sys.stderr)
        sys.exit(1)

    packages_deno.update({v: k for k, v in ADDITIONAL_PACKAGES_NODE.items()})
    packages_node.update({v: k for k, v in ADDITIONAL_PACKAGES_DENO.items()})
    differences = packages_deno.keys() ^ packages_node.keys()

    if diffs_deno := differences.intersection(packages_deno):
        print(
            "deno =>  npm:",
            *(f"{packages_deno[h]} ({h})" for h in diffs_deno),
            sep="\n\t",
        )

    if diffs_node := differences.intersection(packages_node):
        print(
            " npm => deno:",
            *(f"{packages_node[h]} ({h})" for h in diffs_node),
            sep="\n\t",
        )

    if differences:
        sys.exit(1)


if __name__ == "__main__":
    main()
