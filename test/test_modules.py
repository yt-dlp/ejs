import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pathlib import Path

CORE_PATH = Path('yt_dlp_ejs/yt/solver/core.min.js')
LIB_PATH = Path('yt_dlp_ejs/yt/solver/lib.min.js')


class TestModules(unittest.TestCase):
    def setUp(self):
        for path in (CORE_PATH, LIB_PATH):
            if not path.exists():
                path.write_text(str(path), encoding='utf-8')

    def tearDown(self):
        for path in (CORE_PATH, LIB_PATH):
            if path.read_text(encoding='utf-8') == str(path):
                path.unlink()

    def test_yt_solver(self):
        import yt_dlp_ejs.yt.solver
        self.assertEqual(yt_dlp_ejs.yt.solver.core(), CORE_PATH.read_text(encoding='utf-8'))
        self.assertEqual(yt_dlp_ejs.yt.solver.lib(), LIB_PATH.read_text(encoding='utf-8'))


if __name__ == '__main__':
    unittest.main()
