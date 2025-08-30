import importlib.resources
import importlib.metadata

import yt_dlp_jsc_deno

_name = "jsc-deno.js"

version = importlib.metadata.version(yt_dlp_jsc_deno.__name__)


def exists() -> bool:
    return importlib.resources.is_resource(yt_dlp_jsc_deno, _name)


def read() -> str:
    return importlib.resources.read_text(yt_dlp_jsc_deno, _name)


def path():
    return importlib.resources.path(yt_dlp_jsc_deno, _name)
