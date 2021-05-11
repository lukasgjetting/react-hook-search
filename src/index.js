"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// Concatenate the values of the item attributes
const getItemString = (item, attributes) => attributes.reduce((str, a) => {
    let newValue = '';
    if (item[a].toString !== null && item[a].toString !== undefined) {
        newValue = item[a].toString();
    }
    return `${str} ${newValue}`;
}, '');
// Makes sure the itemString contains every word in the searchValue
const itemStringMatches = (itemString, searchValue) => searchValue.toLowerCase().split(' ').every((word) => itemString.includes(word));
// Takes an array of objects and EITHER an array of strings (attributes) OR a predicate 
// The specified attributes of the objects will be filtered
// based on the searchValue (value and setter returned)
const useSearch = (items, attributesOrPredicate) => {
    const [searchValue, setSearchValue] = react_1.useState('');
    const onSearchChange = react_1.useCallback((eventOrValue) => {
        // Might be an actual onChange event
        // Or it might just be set directly
        if (typeof eventOrValue === 'string') {
            setSearchValue(eventOrValue);
        }
        else {
            setSearchValue(eventOrValue.currentTarget.value);
        }
    }, []);
    let attributes;
    let predicate = null;
    if (Array.isArray(attributesOrPredicate)) {
        attributes = attributesOrPredicate;
    }
    else if (typeof attributesOrPredicate === 'string') {
        predicate = attributesOrPredicate;
        attributes = [];
    }
    else {
        throw new Error('The second argument passed to useSearch must be either an array of attributes or a predicate.');
    }
    // attributes will change on every render if they're just passed like ['attr1', 'attr2', ...]
    // So we use the JSON result as a dependency, as it will
    // always return the same for the same attribute list
    const attributeJson = JSON.stringify(attributes);
    const itemStrings = react_1.useMemo(() => items.map((i) => getItemString(i, attributes)), 
    // Intentional that we use attributeJson instead of attributes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, attributeJson]);
    const filteredItems = react_1.useMemo(() => {
        if (searchValue === '') {
            return items;
        }
        if (predicate == null) {
            return items.filter((item, index) => (itemStringMatches(itemStrings[index], searchValue)));
        }
        return items.filter((item, index) => predicate(searchValue, item, index));
    }, [searchValue, items, itemStrings, predicate]);
    return [filteredItems, searchValue, onSearchChange];
};
exports.default = useSearch;
