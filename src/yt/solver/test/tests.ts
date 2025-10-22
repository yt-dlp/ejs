type Step = {
  input: string;
  expected: string;
};

export const tests: {
  player: string;
  variants?: Variant[];
  n?: Step[];
  sig?: Step[];
}[] = [
  {
    player: "3d3ba064",
    n: [
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
    n: [{ input: "0eRGgQWJGfT5rFHFj", expected: "4SvMpDQH-vBJCw" }],
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
    n: [
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
    n: [
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
  {
    player: "3597727b",
    n: [
      // Synthetic test
      { input: "0eRGgQWJGfT5rFHFj", expected: "PRwo5dDfisg0ejA2" },
    ],
    sig: [
      // Synthetic test
      {
        input:
          "MMGZJMUucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHS6S7uYq4TGjQX_D4aPk99hNU6wbTvorvVVMgIARwsSdQfJAA",
        expected:
          "AAJfQdSswRAIgMVVvrovTbw6UNh99kPa4D_XQjGT4qYuMS6SHM8Ej7CACIEQnz-nKN5RgG6iUTnNJC58csYPSroS_SzricuUMJZG",
      },
    ],
  },
  {
    // tce causes exception even in browser
    player: "3752a005",
    variants: ["main", "tcc", "es5", "es6", "tv", "tv_es6", "phone", "tablet"],
    n: [
      // Synthetic test
      { input: "0eRGgQWJGfT5rFHFj", expected: "j22ZtsqVsR0Dn" },
    ],
    sig: [
      // Synthetic test
      {
        input:
          "MMGZJMUucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHS6S7uYq4TGjQX_D4aPk99hNU6wbTvorvVVMgIARwsSdQfJAA",
        expected:
          "ZJM_ucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHG6S7uYq4TGjQXSD4aPk99hNU6wbTvorvVVMgIARwsSdQfJAA",
      },
    ],
  },
  {
    // tce causes exception even in browser
    player: "afc7785b",
    variants: ["main", "tcc", "es5", "es6", "tv", "tv_es6", "phone", "tablet"],
    n: [
      // Synthetic test
      { input: "0eRGgQWJGfT5rFHFj", expected: "j22ZtsqVsR0Dn" },
    ],
    sig: [
      // Synthetic test
      {
        input:
          "MMGZJMUucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHS6S7uYq4TGjQX_D4aPk99hNU6wbTvorvVVMgIARwsSdQfJAA",
        expected:
          "ZJM_ucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHG6S7uYq4TGjQXSD4aPk99hNU6wbTvorvVVMgIARwsSdQfJAA",
      },
    ],
  },
  {
    // tce causes exception even in browser
    player: "b9645327",
    variants: ["main", "tcc", "es5", "es6", "tv", "tv_es6", "phone", "tablet"],
    n: [
      // Synthetic test
      { input: "0eRGgQWJGfT5rFHFj", expected: "j22ZtsqVsR0Dn" },
    ],
    sig: [
      // Synthetic test
      {
        input:
          "MMGZJMUucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHS6S7uYq4TGjQX_D4aPk99hNU6wbTvorvVVMgIARwsSdQfJAA",
        expected:
          "ZJM_ucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHG6S7uYq4TGjQXSD4aPk99hNU6wbTvorvVVMgIARwsSdQfJAA",
      },
    ],
  },
  {
    // tce causes exception even in browser
    player: "035b9195",
    variants: ["main", "tcc", "es5", "es6", "tv", "tv_es6", "phone", "tablet"],
    n: [
      // Synthetic test
      { input: "0eRGgQWJGfT5rFHFj", expected: "j22ZtsqVsR0Dn" },
    ],
    sig: [
      // Synthetic test
      {
        input:
          "MMGZJMUucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHS6S7uYq4TGjQX_D4aPk99hNU6wbTvorvVVMgIARwsSdQfJAA",
        expected:
          "ZJM_ucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHG6S7uYq4TGjQXSD4aPk99hNU6wbTvorvVVMgIARwsSdQfJAA",
      },
    ],
  },
  {
    player: "6740c111",
    n: [
      // Synthetic test
      { input: "0eRGgQWJGfT5rFHFj", expected: "AVsXYE0uE1k8e" },
    ],
    sig: [
      // Synthetic test
      {
        input:
          "MMGZJMUucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHS6S7uYq4TGjQX_D4aPk99hNU6wbTvorvVVMgIARwsSdQfJAA",
        expected:
          "JfQdSswRAIgMVVvrovTbw6UNh99kPa4D_XQjGT4qYu7S6SHM8EjoCACIEQnz-MKN5RgG6iUTnNJC58csYPSrnS_SzricuUMJZGn",
      },
    ],
  },
  {
    player: "f6a4f3bc",
    n: [
      // Synthetic test
      { input: "0eRGgQWJGfT5rFHFj", expected: "H1NKYFbhlqZ" },
    ],
    sig: [
      // Synthetic test
      {
        input:
          "MMGZJMUucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHS6S7uYq4TGjQX_D4aPk99hNU6wbTvorvVVMgIARwsSdQfJAA",
        expected:
          "JfQdSswRAIgMVVvrovTbw6UNh99kPa4D_XQjGT4qYM7S6SHM8EjoCACIEQnz-nKM5RgG6iUTnNJC58cNYPSrnS_SzricuUMJZGu",
      },
    ],
  },
  {
    player: "b66835e2",
    n: [
      // Synthetic test
      { input: "0eRGgQWJGfT5rFHFj", expected: "H1NKYFbhlqZ" },
    ],
    sig: [
      // Synthetic test
      {
        input:
          "MMGZJMUucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHS6S7uYq4TGjQX_D4aPk99hNU6wbTvorvVVMgIARwsSdQfJAA",
        expected:
          "JfQdSswRAIgMVVvrovTbw6UNh99kPa4D_XQjGT4qYM7S6SHM8EjoCACIEQnz-nKM5RgG6iUTnNJC58cNYPSrnS_SzricuUMJZGu",
      },
    ],
  },
  {
    player: "4f8fa943",
    n: [
      // Synthetic test
      { input: "0eRGgQWJGfT5rFHFj", expected: "JWWr7hDSRpMq5" },
    ],
    sig: [
      // Synthetic test
      {
        input:
          "MMGZJMUucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHS6S7uYq4TGjQX_D4aPk99hNU6wbTvorvVVMgIARwsSdQfJAA",
        expected:
          "AAJfQdSswRAIgMVVvrovTbw6UNh99kPa4D_XQjGT4qYu7S6SHr8EjoCACIEQnz-nKN5RgG6iUTnNZC58csYPSMnS_SzricuUM",
      },
    ],
  },
  {
    player: "0004de42",
    n: [
      // Synthetic test
      { input: "0eRGgQWJGfT5rFHFj", expected: "OPd7UEsCDmCw4qD0" },
    ],
    sig: [
      // Synthetic test
      {
        input:
          "MMGZJMUucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHS6S7uYq4TGjQX_D4aPk99hNU6wbTvorvVVMgIARwsSdQfJAA",
        expected:
          "ZJMUucirzS_SnrSPYsc85MJNnTUi6GgR5NCn-znQEICACojE8MHS6S7uYq4TGjQX_D4aPk99hNU6wbTvorvVVMgIARwsSdQ",
      },
    ],
  },
  {
    player: "2b83d2e0",
    n: [
      // Synthetic test
      { input: "0eRGgQWJGfT5rFHFj", expected: "euHbygrCMLksxd" },
    ],
    sig: [
      // Synthetic test
      {
        input:
          "MMGZJMUucirzS_SnrSPYsc85CJNnTUi6GgR5NKn-znQEICACojE8MHS6S7uYq4TGjQX_D4aPk99hNU6wbTvorvVVMgIARwsSdQfJA",
        expected:
          "-MGZJMUucirzS_SnrSPYsc85CJNnTUi6GgR5NKnMznQEICACojE8MHS6S7uYq4TGjQX_D4aPk99hNU6wbTvorvVVMgIARwsSdQfJ",
      },
    ],
  },
  {
    // TODO: es6/tv_es6 variants currently fail
    player: "638ec5c6",
    variants: ["main", "tcc", "tce", "es5", "tv", "phone", "tablet"],
    n: [
      // Synthetic test
      { input: "ZdZIqFPQK-Ty8wId", expected: "1qov8-KM-yH" },
    ],
    sig: [
      // Synthetic test
      {
        input:
          "gN7a-hudCuAuPH6fByOk1_GNXN0yNMHShjZXS2VOgsEItAJz0tipeavEOmNdYN-wUtcEqD3bCXjc0iyKfAyZxCBGgIARwsSdQfJ2CJtt",
        expected:
          "MhudCuAuP-6fByOk1_GNXN7gNHHShjyXS2VOgsEItAJz0tipeav0OmNdYN-wUtcEqD3bCXjc0iyKfAyZxCBGgIARwsSdQfJ2CJtt",
      },
    ],
  },
];

export const players = new Map([
  ["main", "player_ias.vflset/en_US/base.js"],
  ["tcc", "player_ias_tcc.vflset/en_US/base.js"],
  ["tce", "player_ias_tce.vflset/en_US/base.js"],
  ["es5", "player_es5.vflset/en_US/base.js"],
  ["es6", "player_es6.vflset/en_US/base.js"],
  ["tv", "tv-player-ias.vflset/tv-player-ias.js"],
  ["tv_es6", "tv-player-es6.vflset/tv-player-es6.js"],
  ["phone", "player-plasma-ias-phone-en_US.vflset/base.js"],
  ["tablet", "player-plasma-ias-tablet-en_US.vflset/base.js"],
] as const);

export type Variant = typeof players extends Map<infer T, unknown> ? T : never;
