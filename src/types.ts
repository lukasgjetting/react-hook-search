export interface Item {
  [key: string]: null | undefined | { toString(): string }
}

export type OnSearchChange = (eventOrValue: string | React.FormEvent<HTMLInputElement>) => void;

export type FilterPredicate = <T extends Item>(
    searchValue: string,
    item: T,
    index: number,
) => boolean;

export type UseSearchHook = <T extends Item>(
    items: T[],
    attributesOrPredicate: (keyof T & string)[] | FilterPredicate
  ) => [T[], string, OnSearchChange];
