import {
  useState,
  useMemo,
} from 'react';

// Concatenate the values of the item attributes
const getItemString = (item, attributes) => attributes.reduce(
  (str, a) => `${str} ${item[a].toString().toLowerCase()}`,
  '',
);

// Makes sure the itemString contains every word in the searchValue
const itemStringMatches = (itemString, searchValue) => searchValue.toLowerCase().split(' ').every(
  (word) => itemString.includes(word),
);

// Takes an array of objects and an array of strings
// The specified attributes of the objects will be filtered
// based on the searchValue (value and setter returned)
const useSearch = (items, attributes) => {
  const [searchValue, setSearchValue] = useState('');

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

  const filteredItems = useMemo(() => (searchValue === '' ?
    items :
    items.filter((item, index) => itemStringMatches(itemStrings[index], searchValue))
  ), [searchValue, items, itemStrings]);

  return [filteredItems, searchValue, setSearchValue];
};

export default useSearch;
