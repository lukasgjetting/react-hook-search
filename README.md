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

```
import useSearch from 'react-hook-search';

const items = [
	{ name: 'John Doe', address: '4251 Carolyns Circle' },
	{ name: 'Jane Doe', address: '10 Downing Street' },
	{ name: 'Mike', address: 'Somewhere, I tell ya!' },
];

const attributes = ['name', 'address'];

const App = () => {
	const [filteredItems, search, setSearch] = useSearch(items, attributes);

	return (
		<>
			<input
				value={search}
				onChange={setSearch}
			/>
			<div>
				{filteredItems.map((item) => (
					<div key={item.name}>
						{item.name} - {item.address}
					</div>
				))}
			</div>
		</>
	);
};
```