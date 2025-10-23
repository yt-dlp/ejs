import importlib.resources

import yt_dlp_ejs.yt.solver


def core() -> str:
    """
    Read the contents of the JavaScript core solver bundle as string.
    """
    return importlib.resources.read_text(yt_dlp_ejs.yt.solver, "core.min.js")


def lib() -> str:
    """
    Read the contents of the JavaScript library solver bundle as string.
    """
    return importlib.resources.read_text(yt_dlp_ejs.yt.solver, "lib.min.js")
