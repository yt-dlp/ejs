import importlib.resources

import yt_dlp_ejs
# XXX: this reflects package version
from yt_dlp_ejs._version import version


def yt_solver_core() -> str:
    """
    Read the contents of the JavaScript core solver bundle as string.
    """
    return importlib.resources.read_text(yt_dlp_ejs, 'yt.solver.core.min.js')


def yt_solver_lib() -> str:
    """
    Read the contents of the JavaScript library solver bundle as string.
    """
    return importlib.resources.read_text(yt_dlp_ejs, 'yt.solver.lib.min.js')

__all__ = [
    "core",
    "lib",
    "version",
]
