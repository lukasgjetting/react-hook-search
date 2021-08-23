export type OnSearchChange = (eventOrValue: string | React.FormEvent<HTMLInputElement>) => void;

export type FilterPredicate<T> = (
  searchValue: string,
  item: T,
  index: number,
) => boolean;

export type UseSearchHook = <T>(
  items: T[],
  attributesOrPredicate: (keyof T & string)[] | FilterPredicate<T>
) => [T[], string, OnSearchChange];
