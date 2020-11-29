# React Hook Search

A react hook which allows easy implementation of search functionality

## Installation

```
yarn add react-hook-search
```

or

```
npm install --save react-hook-search
```

## Usage

Pass an array of objects (the dataset) and either an array of strings (attributes to search through in the dataset) or a predicate.

In return, you get an array containing the filtered dataset, the current search value and an onChange handler.

## Example

```javascript
import useSearch from 'react-hook-search';

const items = [
  { id: 1, name: 'John Doe', address: '4251 Carolyns Circle' },
  { id: 2, name: 'Jane Doe', address: '10 Downing Street' },
  { id: 3, name: 'Mike', address: 'Somewhere, I tell ya!' },
];

const attributes = ['name', 'address'];

const App = () => {
  // The search function will search through 'name' and 'address', but not 'id'
  const [filteredItems, search, setSearch] = useSearch(items, attributes);

  // OR

  // The predicate will only return items that match the name (case sensitive)
  const [filteredItems, search, setSearch] = useSearch(items, (searchValue, item) => item.name.includes(searchValue));

  return (
    <>
      <input
        value={search}
        onChange={setSearch}
      />
      <div>
        {filteredItems.map((item) => (
          <div key={item.id}>
            {item.name} - {item.address}
          </div>
        ))}
      </div>
    </>
  );
};
```

## Contributing

Issues and PRs are more than welcome. Thanks!