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
    // 20518
    player: "edc3ba07",
    n: [{ input: "BQoJvGBkC2nj1ZZLK-", expected: "-m-se9fQVnvEofLx" }],
    sig: [
      {
        input:
          "NJAJEij0EwRgIhAI0KExTgjfPk-MPM9MAdzyyPRt=BM8-XO5tm5hlMCSVpAiEAv7eP3CURqZNSPow8BXXAoazVoXgeMP7gH9BdylHCwgw=gwzz",
        expected:
          "zwg=wgwCHlydB9zg7PMegXoVzaoAXXB8woPSNZqRUC3Pe7vAEiApVSCMlh5mt5OX-8MB=tRPyyEdAM9MPM-kPfjgTxEK0IAhIgRwE0jiz",
      },
    ],
  },
  {
    // 20521
    player: "316b61b4",
    n: [{ input: "IlLiA21ny7gqA2m4p37", expected: "GchRcsUC_WmnhOUVGV" }],
    sig: [
      {
        input:
          "NJAJEij0EwRgIhAI0KExTgjfPk-MPM9MAdzyyPRt=BM8-XO5tm5hlMCSVpAiEAv7eP3CURqZNSPow8BXXAoazVoXgeMP7gH9BdylHCwgw=gwzz",
        expected:
          "tJAJEij0EwRgIhAI0KExTgjfPk-MPM9MAdzyyPRN=BM8-XO5tm5hlMCSVpAiEAv7eP3CURqZNSPow8BXXAoazVoXgeMP7gH9BdylHCwgw=gwz",
      },
    ],
  },
  {
    // 20522
    player: "74edf1a3",
    n: [
      { input: "IlLiA21ny7gqA2m4p37", expected: "9nRTxrbM1f0yHg" },
      { input: "eabGFpsUKuWHXGh6FR4", expected: "izmYqDEY6kl7Sg" },
      { input: "eabGF/ps%UK=uWHXGh6FR4", expected: "LACmqlhaBpiPlgE-a" },
    ],
    sig: [
      {
        input:
          "NJAJEij0EwRgIhAI0KExTgjfPk-MPM9MAdzyyPRt=BM8-XO5tm5hlMCSVpAiEAv7eP3CURqZNSPow8BXXAoazVoXgeMP7gH9BdylHCwgw=gwzz",
        expected:
          "NJAJEij0EwRgIhAI0KExTgjfPk-MPM9MAdzyyPRt=BM8-XO5tm5hzMCSVpAiEAv7eP3CURqZNSPow8BXXAoazVoXgeMP7gH9BdylHCwgw=gwzl",
      },
      {
        input:
          "\x00\x01\x02%\x03\x04\x05\x06\x07\x08\x09\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x20\x21\x22\x23\x24\x25\x26\x27\x28\x29\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x40\x41\x42\x43\x44\x45\x46\x47\x48\x49",
        expected:
          "\x00\x01\x02%\x03\x04\x05\x06\x07\x08\x09\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x20\x21\x22\x23\x24\x25\x26\x27\x28\x29\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x40\x41\x42\x49\x44\x45\x46\x47\x48\x43",
      },
    ],
  },
  {
    // 20523
    player: "901741ab",
    n: [{ input: "BQoJvGBkC2nj1ZZLK-", expected: "UMPovvBZRh-sjb" }],
    sig: [
      {
        input:
          "NJAJEij0EwRgIhAI0KExTgjfPk-MPM9MAdzyyPRt=BM8-XO5tm5hlMCSVpAiEAv7eP3CURqZNSPow8BXXAoazVoXgeMP7gH9BdylHCwgw=gwzz",
        expected:
          "wgwCHlydB9Hg7PMegXoVzaoAXXB8woPSNZqRUC3Pe7vAEiApVSCMlhwmt5ON-8MB=5RPyyzdAM9MPM-kPfjgTxEK0IAhIgRwE0jiEJA",
      },
    ],
  },
  {
    // 20524
    player: "e7573094",
    n: [{ input: "IlLiA21ny7gqA2m4p37", expected: "3KuQ3235dojTSjo4" }],
    sig: [
      {
        input:
          "NJAJEij0EwRgIhAI0KExTgjfPk-MPM9MAdzyyPRt=BM8-XO5tm5hlMCSVpAiEAv7eP3CURqZNSPow8BXXAoazVoXgeMP7gH9BdylHCwgw=gwzz",
        expected:
          "yEij0EwRgIhAI0KExTgjfPk-MPM9MAdzyNPRt=BM8-XO5tm5hlMCSVNAiEAvpeP3CURqZJSPow8BXXAoazVoXgeMP7gH9BdylHCwgw=g",
      },
    ],
  },
];

export const players = new Map([
  ["main", "player_ias.vflset/en_US/base.js"],
  ["tcc", "player_ias_tcc.vflset/en_US/base.js"],
  ["tce", "player_ias_tce.vflset/en_US/base.js"],
  ["es6", "player_es6.vflset/en_US/base.js"],
  ["tv", "tv-player-ias.vflset/tv-player-ias.js"],
  ["tv_es6", "tv-player-es6.vflset/tv-player-es6.js"],
  ["phone", "player-plasma-ias-phone-en_US.vflset/base.js"],
  ["es6_tcc", "player_es6_tcc.vflset/en_US/base.js"],
  ["es6_tce", "player_es6_tce.vflset/en_US/base.js"],
] as const);

export type Variant = typeof players extends Map<infer T, unknown> ? T : never;
