import importlib.resources

import yt_dlp_ejs.yt.solver

def core() -> str:
    """
    Read the contents of the JavaScript core solver bundle as string.
    """
    return (importlib.resources.files(yt_dlp_ejs.yt.solver) / "core.min.js").read_text()


def lib() -> str:
    """
    Read the contents of the JavaScript library solver bundle as string.
    """
    return (importlib.resources.files(yt_dlp_ejs.yt.solver) / "lib.min.js").read_text()
