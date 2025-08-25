type Step = {
  input: string;
  expected: string;
};

export const tests: {
  player: string;
  variants?: Variant[];
  nsig?: Step[];
  sig?: Step[];
}[] = [
  {
    player: "3d3ba064",
    nsig: [
      { input: "ZdZIqFPQK-Ty8wId", expected: "qmtUsIz04xxiNW" },
      { input: "4GMrWHyKI5cEvhDO", expected: "N9gmEX7YhKTSmw" },
    ],
    sig: [
      {
        input:
          "gN7a-hudCuAuPH6fByOk1_GNXN0yNMHShjZXS2VOgsEItAJz0tipeavEOmNdYN-wUtcEqD3bCXjc0iyKfAyZxCBGgIARwsSdQfJ2CJtt",
        expected:
          "ttJC2JfQdSswRAIgGBCxZyAfKyi0cjXCb3gqEctUw-NYdNmOEvaepit0zJAtIEsgOV2SXZjhSHMNy0NXNG_1kNyBf6HPuAuCduh-a7O",
      },
    ],
  },
  {
    player: "5ec65609",
    nsig: [{ input: "0eRGgQWJGfT5rFHFj", expected: "4SvMpDQH-vBJCw" }],
    sig: [
      {
        input:
          "AAJAJfQdSswRQIhAMG5SN7-cAFChdrE7tLA6grH0rTMICA1mmDc0HoXgW3CAiAQQ4=CspfaF_vt82XH5yewvqcuEkvzeTsbRuHssRMyJQ=I",
        expected:
          "AJfQdSswRQIhAMG5SN7-cAFChdrE7tLA6grI0rTMICA1mmDc0HoXgW3CAiAQQ4HCspfaF_vt82XH5yewvqcuEkvzeTsbRuHssRMyJQ==",
      },
    ],
  },
  {
    player: "6742b2b9",
    nsig: [
      { input: "_HPB-7GFg1VTkn9u", expected: "qUAsPryAO_ByYg" },
      { input: "K1t_fcB6phzuq2SF", expected: "Y7PcOt3VE62mog" },
    ],
    sig: [
      {
        input:
          "MMGZJMUucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHS6S7uYq4TGjQX_D4aPk99hNU6wbTvorvVVMgIARwsSdQfJAA",
        expected:
          "AJfQdSswRAIgMVVvrovTbw6UNh99kPa4D_XQjGT4qYu7S6SHM8EjoCACIEQnz-nKN5RgG6iUTnNJC58csYPSrnS_SzricuUMJZGM",
      },
    ],
  },
  {
    player: "23ccdd25",
    nsig: [
      // Synthetic test
      { input: "0eRGgQWJGfT5rFHFj", expected: "orSsTqUaUO-j" },
    ],
    sig: [
      // Synthetic test
      {
        input:
          "MMGZJMUucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHS6S7uYq4TGjQX_D4aPk99hNU6wbTvorvVVMgIARwsSdQfJAA",
        expected:
          "ZJMUucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHS6S7uYq4TGjQX_D4aPk99hAU6wbTvorvVVMgIARwsSdQfJAN",
      },
    ],
  },
];

export const players = new Map(
  [
    ["main", "player_ias.vflset/en_US/base.js"],
    ["tcc", "player_ias_tcc.vflset/en_US/base.js"],
    ["tce", "player_ias_tce.vflset/en_US/base.js"],
    ["es5", "player_es5.vflset/en_US/base.js"],
    ["es6", "player_es6.vflset/en_US/base.js"],
    ["tv", "tv-player-ias.vflset/tv-player-ias.js"],
    ["tv_es6", "tv-player-es6.vflset/tv-player-es6.js"],
    ["phone", "player-plasma-ias-phone-en_US.vflset/base.js"],
    ["tablet", "player-plasma-ias-tablet-en_US.vflset/base.js"],
  ] as const,
);

export type Variant = (typeof players) extends Map<infer T, unknown> ? T
  : never;
