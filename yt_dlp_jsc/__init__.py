import importlib.resources
import importlib.metadata

import yt_dlp_jsc

version = importlib.metadata.version(yt_dlp_jsc.__name__)


def jsc() -> str:
    """
    Read the contents of the JavaScript jsc bundle as string.
    """
    return importlib.resources.read_text(yt_dlp_jsc, 'jsc.min.js')


def lib() -> str:
    """
    Read the contents of the JavaScript library bundle as string.
    """
    return importlib.resources.read_text(yt_dlp_jsc, 'lib.min.js')

__all__ = [
    "jsc",
    "lib",
    "version",
]
