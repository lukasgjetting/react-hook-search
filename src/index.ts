import {
  useState,
  useMemo,
  useCallback,
} from 'react';

// Concatenate the values of the item attributes
const getItemString = (item, attributes) => attributes.reduce(
  (str, a) => `${str} ${(item[a] || '').toString().toLowerCase()}`,
  '',
);

// Makes sure the itemString contains every word in the searchValue
const itemStringMatches = (itemString, searchValue) => searchValue.toLowerCase().split(' ').every(
  (word) => itemString.includes(word),
);

type searchChange = (eventOrValue: string | React.FormEvent<HTMLInputElement>) => void;
type searchHook = <T>(items: T[], attributesOrPredicate: string[]) => [T[], string, searchChange];

// Takes an array of objects and EITHER an array of strings (attributes) OR a predicate 
// The specified attributes of the objects will be filtered
// based on the searchValue (value and setter returned)
const useSearch: searchHook  = (items, attributesOrPredicate) => {
  const [searchValue, setSearchValue] = useState('');

  const onSearchChange: searchChange = useCallback((eventOrValue) => {
  	// Might be an actual onChange event
  	// Or it might just be set directly
  	if (typeof eventOrValue === 'string') {
      setSearchValue(eventOrValue);
    } else {
      setSearchValue(eventOrValue.target.value);
    }
  }, []);

  let attributes;
  let predicate;

  if (Array.isArray(attributesOrPredicate)) {
    attributes = [];
    predicate = attributesOrPredicate;
  } else if (typeof attributesOrPredicate === 'string') {
    attributes = attributesOrPredicate;
  } else {
    throw new Error('The second argument passed to useSearch must be either an array of attributes or a predicate.');
  }

  // attributes will change on every render if they're just passed like ['attr1', 'attr2', ...]
  // So we use the JSON result as a dependency, as it will
  // always return the same for the same attribute list
  const attributeJson = JSON.stringify(attributes);

  const itemStrings = useMemo(
    () => items.map((i) => getItemString(i, attributes)),
    // Intentional that we use attributeJson instead of attributes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, attributeJson],
  );

  const filteredItems = useMemo(() => {
    if (searchValue === '') {
      return items;
    }

    if (predicate != null) {
      return items.filter((item, index) => predicate(searchValue, item, index));
    }

    return items.filter((item, index) => (
      itemStringMatches(itemStrings[index], searchValue)
    ));
  }, [searchValue, items, itemStrings, predicate]);

  return [filteredItems, searchValue, onSearchChange];
};

export default useSearch;
