type Step = {
  input: string;
  expected: string;
};

const playerVariants = [
  ["main": "player_ias.vflset/en_US/base.js"],
  ["tcc": "player_ias_tcc.vflset/en_US/base.js"],
  ["tce": "player_ias_tce.vflset/en_US/base.js"],
  ["es6": "player_es6.vflset/en_US/base.js"],
  ["es6_tcc": "player_es6_tcc.vflset/en_US/base.js"],
  ["es6_tce": "player_es6_tce.vflset/en_US/base.js"],
  ["tv": "tv-player-ias.vflset/tv-player-ias.js"],
  ["tv_tcc": "tv-player-ias-tcc.vflset/tv-player-ias-tcc.js"],
  ["tv_tce": "tv-player-ias-tce.vflset/tv-player-ias-tce.js"],
  ["tv_es6": "tv-player-es6.vflset/tv-player-es6.js"],
  ["tv_es6_tcc": "tv-player-es6-tcc.vflset/tv-player-es6-tcc.js"],
  ["tv_es6_tce": "tv-player-es6-tce.vflset/tv-player-es6-tce.js"],
  ["phone": "player-plasma-ias-phone-en_US.vflset/base.js"],
  ["phone_tcc": "player-plasma-ias-phone-tcc-en_US.vflset/base.js"],
  ["phone_tce": "player-plasma-ias-phone-tce-en_US.vflset/base.js"],
  ["plasma_es6": "player-plasma-es6-en_US.vflset/base.js"],
  ["plasma_es6_tcc": "player-plasma-es6-tcc-en_US.vflset/base.js"],
  ["plasma_es6_tce": "player-plasma-es6-tce-en_US.vflset/base.js"],
  ["embed": "player_embed.vflset/en_US/base.js"],
  ["embed_tcc": "player_embed_tcc.vflset/en_US/base.js"],
  ["embed_tce": "player_embed_tce.vflset/en_US/base.js"],
  ["embed_es6": "player_embed_es6.vflset/en_US/base.js"],
  ["embed_es6_tcc": "player_embed_es6_tcc.vflset/en_US/base.js"],
  ["embed_es6_tce": "player_embed_es6_tce.vflset/en_US/base.js"],
  ["house": "house_brand_player.vflset/en_US/base.js"],
  ["house_es6": "house_brand_player_es6.vflset/en_US/base.js"],
  ["tcl": "player_ias_tcl.vflset/en_US/base.js"],
  ["es6_tcl": "player_es6_tcl.vflset/en_US/base.js"],
  ["tv_tcl": "tv-player-ias-tcl.vflset/tv-player-ias-tcl.js"],
  ["tv_es6_tcl": "tv-player-es6-tcl.vflset/tv-player-es6-tcl.js"],
  ["phone_tcl": "player-plasma-ias-phone-tcl-en_US.vflset/base.js"],
  ["plasma_es6_tcl": "player-plasma-es6-tcl-en_US.vflset/base.js"],
  ["embed_tcl": "player_embed_tcl.vflset/en_US/base.js"],
  ["embed_es6_tcl": "player_embed_es6_tcl.vflset/en_US/base.js"],
] as const;

export type Variant = (typeof playerVariants)[number][0];

export const players = new Map(playerVariants);

function except(...variants: Variant[]): Variant[] {
  return playerVariants.map((v) => v[0]).filter((v) => !variants.includes(v));
}

function exceptTclVariants(): Variant[] {
  return playerVariants.map((v) => v[0]).filter((v) => !v.endsWith("tcl"));
}

function onlyTclVariants(): Variant[] {
  return playerVariants.map((v) => v[0]).filter((v) => v.endsWith("tcl"));
}

export const tests: {
  player: string;
  variants?: Variant[];
  n?: Step[];
  sig?: Step[];
}[] = [
  {
    // 20524
    player: "e7573094",
    variants: except("embed_tcl", "tcl"),
    n: [{ input: "IlLiA21ny7gqA2m4p37", expected: "3KuQ3235dojTSjo4" }],
    sig: [
      {
        input:
          "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F202122232425262728292A2B2C2D2E2F303132333435363738393A3B3C3D3E3F404142434445464748494A4B4C4D4E4F505152535455565758595A5B5C5D5E5F606162636465666768696A",
        expected:
          "240405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F202122234825262728292A2B2C2D2E2F303132333435363738003A3B3C3D3E39404142434445464703494A4B4C4D4E4F505152535455565758595A5B5C5D5E5F6061626364656667",
      },
    ],
  },
  {
    // 20525
    player: "9fcf08e8",
    n: [{ input: "4JRSxxN0E_fLVnxmd", expected: "xhAoMP8xPcR5wg" }],
    sig: [
      {
        input:
          "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F202122232425262728292A2B2C2D2E2F303132333435363738393A3B3C3D3E3F404142434445464748494A4B4C4D4E4F505152535455565758595A5B5C5D5E5F606162636465666768696A",
        expected:
          "6A696867666564636261605F5E5D5C5B5A595857565554535251504F4E4D4C4B4A494847464544434241403F3E3D3C3B3A393837363534333231302F2E2D2C2B2A292827262524232221201F1E1D1C1B1A191817161514131211100F0E0D0C0B030908070605040A",
      },
    ],
  },
  {
    // 20527
    player: "21cd2156",
    n: [{ input: "16EF3jx-Mr_TLuGH", expected: "OQJDc7IrlWCkfg" }],
    sig: [
      {
        input:
          "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F202122232425262728292A2B2C2D2E2F303132333435363738393A3B3C3D3E3F404142434445464748494A4B4C4D4E4F505152535455565758595A5B5C5D5E5F606162636465666768696A",
        expected:
          "030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F202122232425262728292A2B2C2D2E2F303132333435363738393A3B3C3D3E3F404142434400464748494A4B6A4D4E4F505152535455565758595A5B5C5D5E5F606162636465666768694C",
      },
    ],
  },
  {
    // 20528 (tv & tv_es6 needed self.location.origin fix)
    player: "76ad2fe8",
    n: [{ input: "V8pdMGD0Sz_M0DRT", expected: "rBnTGCWGFpwByA" }],
    sig: [
      {
        input:
          "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F202122232425262728292A2B2C2D2E2F303132333435363738393A3B3C3D3E3F404142434445464748494A4B4C4D4E4F505152535455565758595A5B5C5D5E5F606162636465666768696A",
        expected:
          "46666564636261605F5E676A5B5A595857565554535251504F4E4D4C4B4A4948472C4544434241403F3E3D3C3B3A393813363534333231302F2E2D5D2B2A292827262524232221201F1E1D1C1B1A1918171615140C1211100F0E0D000B0A09080706050403020137",
      },
    ],
  },
  {
    // 20529 (tv & tv_es6 needed self.location.origin fix)
    player: "631d3938",
    variants: except("embed_tcl"),
    n: [{ input: "KBx1qz7jMhxELa8c", expected: "ttPvh7WIptsgSw" }],
    sig: [
      {
        input:
          "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F202122232425262728292A2B2C2D2E2F303132333435363738393A3B3C3D3E3F404142434445464748494A4B4C4D4E4F505152535455565758595A5B5C5D5E5F60616263646566",
        expected:
          "190102030405060708090A0B0C0D0E0F101112131415161718001A1B1C1D1E1F202122232425262728292A2B2C2D2E2F303132333435363738393A3B3C3D3E3F404142434445464748494A4B4C4D4E4F505152535455565758595A5B5C5D5E5F60616263",
      },
    ],
  },
  {
    // 20671001 (*tcl)
    player: "879f7172",
    variants: onlyTclVariants(),
    n: [{ input: "nkWoI9oUWkorXYqR", expected: "hQ3dJ8aYPJ1Q" }],
    sig: [
      {
        input:
          "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F202122232425262728292A2B2C2D2E2F303132333435363738393A3B3C3D3E3F404142434445464748494A4B4C4D4E4F505152535455565758595A5B5C5D5E5F60616263646566",
        expected:
          "666564636261605F5E5D5C5B5A595857565554535251504F4E4D4C4B4A494847464544434241403F3E3D3C3B3A393837363534333200302F2E2D2C2B2A292827262524232221201F031D1C1B1A191817161514131211100F0E0D0C0B0A09080706",
      },
    ],
  },
  {
    // 20676001 (*tcl)
    player: "b0d2d49a",
    variants: onlyTclVariants(),
    n: [{ input: "nkWoI9oUWkorXYqR", expected: "h1OpTHKvcEgai6l" }],
    sig: [
      {
        input:
          "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F202122232425262728292A2B2C2D2E2F303132333435363738393A3B3C3D3E3F404142434445464748494A4B4C4D4E4F505152535455565758595A5B5C5D5E5F60616263646566",
        expected:
          "5F626160635E5D5C5B5A595857565554535251504F4E4D4C4B4A494847464544434241403F3E3D3C3B3A393837363534333231302F2E002C2B2A292827262524232221201F1E1D1C1B1A191817161514131211100F0E0D0C0B0A0908070605040302012D",
      },
    ],
  },
  {
    // 20780 (main, tce, tcc: a.addOnDisposeCallback is not a function)
    player: "92eef845",
    variants: exceptTclVariants(),
    n: [{ input: "rYKKd90cGmViBQaX", expected: "3tU2ya-IJqhNt" }],
    sig: [
      {
        input:
          "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F202122232425262728292A2B2C2D2E2F303132333435363738393A3B3C3D3E3F404142434445464748494A4B4C4D4E4F505152535455565758595A5B5C5D5E5F606162636465666768696A",
        expected:
          "5D6564636261605F5E445C5B5A595857565554535251504F4E4D4C4B4A494847464566434241403F3E3D3C3B3A393837363500333231302F692D2C2B2A292827262524232221201F1E1D1C1B1A191817161514131211100F0E0D0C0B0A09080706050403020134",
      },
    ],
  },
  {
    // 20780001 (*tcl)
    player: "92eef845",
    variants: onlyTclVariants(),
    n: [{ input: "rYKKd90cGmViBQaX", expected: "Tk5OqnIAYVzPJeT" }],
    sig: [
      {
        input:
          "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F202122232425262728292A2B2C2D2E2F303132333435363738393A3B3C3D3E3F404142434445464748494A4B4C4D4E4F505152535455565758595A5B5C5D5E5F606162636465666768696A",
        expected:
          "696867666564636261605F5E5D5C5B5A5958576A5554535251504F4E4D4C4B4A494847464544433C41403F3E3D563B3A393837363534333231302F2E2D2C2B2A292827262524232221201F1E1D1C1B1A191817161514131211100F0E0D0C0B0A09080706050403",
      },
    ],
  },
];
