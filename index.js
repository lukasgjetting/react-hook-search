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

// Takes an array of objects and EITHER an array of strings (attributes) OR a predicate 
// The specified attributes of the objects will be filtered
// based on the searchValue (value and setter returned)
const useSearch = (items, attributesOrPredicate) => {
  const [searchValue, setSearchValue] = useState('');

  const onSearchChange = useCallback((event) => {
  	// Might be an actual onChange event
  	// Or it might just be set directly
  	if (event && event.target && event.target.value) {
  		setSearchValue(event.target.value);
  	} else {
  		setSearchValue(event);
  	}
  }, []);

  let attributes;
  let predicate;

  switch (typeof attributesOrPredicate) {
    case 'array':
      attributes = attributesOrPredicate;
      break;

    case 'function':
      attributes = [];
      predicate = attributesOrPredicate;
      break;

    default:
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
      return items.filter(predicate);
    }

    return items.filter((item, index) => (
      itemStringMatches(itemStrings[index], searchValue)
    ));
  }, [searchValue, items, itemStrings, predicate]);

  return [filteredItems, searchValue, onSearchChange];
};

export default useSearch;
