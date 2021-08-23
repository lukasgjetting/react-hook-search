import {
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  UseSearchHook,
  OnSearchChange,
} from './types';

// Concatenate the values of the item attributes
const getItemString = <T>(
  item: T,
  attributes: (keyof T & string)[],
) : string => attributes.reduce(
    (str, a) => {
      const value: { toString?: () => string } = item[a];

      if (value == null || typeof value.toString !== 'function') {
        return str;
      }

      return `${str} ${value.toString()}`;
    },
    '',
  );

// Makes sure the itemString contains every word in the searchValue
const itemStringMatches = (itemString: string, searchValue: string) => (
  searchValue.toLowerCase().split(' ').every(
    (word) => itemString.includes(word),
  )
);

// Takes an array of objects and EITHER an array of strings (attributes) OR a predicate
// The specified attributes of the objects will be filtered
// based on the searchValue (value and setter returned)
const useSearch: UseSearchHook = (items, attributesOrPredicate) => {
  const [searchValue, setSearchValue] = useState('');

  const onSearchChange: OnSearchChange = useCallback((eventOrValue) => {
    // Might be an actual onChange event
    // Or it might just be set directly
    if (typeof eventOrValue === 'string') {
      setSearchValue(eventOrValue);
    } else {
      setSearchValue(eventOrValue.currentTarget.value);
    }
  }, []);

  const attributes = Array.isArray(attributesOrPredicate) ? attributesOrPredicate : [];
  const predicate = typeof attributesOrPredicate === 'function' ? attributesOrPredicate : null;

  // attributes will change on every render if they're just passed like ['attr1', 'attr2', ...]
  // So we use the JSON result as a dependency, as it will
  // always return the same for the same attribute list
  const attributeJson = JSON.stringify(attributes);

  const itemStrings = useMemo(
    () => items.map((i) => getItemString(i, attributes)),
    // Intentional that we use attributeJson instead of attributes
    [items, attributeJson],
  );

  const filteredItems = useMemo(() => {
    if (searchValue === '') {
      return items;
    }

    if (predicate == null) {
      return items.filter((item, index) => (
        itemStringMatches(itemStrings[index], searchValue)
      ));
    }

    return items.filter((item, index) => predicate(searchValue, item, index));
  }, [searchValue, items, itemStrings, predicate]);

  return [filteredItems, searchValue, onSearchChange];
};

export default useSearch;
