import unittest
from pathlib import Path

import yt_dlp_ejs.yt.solver

CORE_PATH = Path('yt_dlp_ejs/yt/solver/core.min.js')
LIB_PATH = Path('yt_dlp_ejs/yt/solver/lib.min.js')


class TestModules(unittest.TestCase):
    def test_yt_solver(self):
        self.assertEqual(yt_dlp_ejs.yt.solver.core(), CORE_PATH.read_text(encoding='utf-8'))
        self.assertEqual(yt_dlp_ejs.yt.solver.lib(), LIB_PATH.read_text(encoding='utf-8'))


if __name__ == '__main__':
    unittest.main()
