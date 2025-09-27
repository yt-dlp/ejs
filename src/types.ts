export type DeepPartial<T> = T extends object
  ? Or<{
      [P in keyof T]?: DeepPartial<T[P]>;
    }>
  : Or<T>;

type Or<T> = T | { or: T[] };
