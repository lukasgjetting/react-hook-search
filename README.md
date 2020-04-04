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

Pass an array of objects (the dataset) and an array of strings (attributes to search through in the dataset).

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