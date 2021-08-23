import { act, renderHook } from '@testing-library/react-hooks';
import useSearch from '../index';

interface User {
  id: number;
  name: String;
  email?: string
}

const users: User[] = [
  { id: 1, name: 'Lukas Gjetting', email: 'lukas@example.com' },
  { id: 2, name: 'GitHub User' },
  { id: 3, name: 'Jest', email: 'jest@example.com' },
];

describe('useSearch', () => {
  it('Returns unfiltered list on first render', () => {
    const { result } = renderHook(() => useSearch(users, []));

    const [filteredUsers] = result.current;

    expect(filteredUsers.length).toBe(users.length);
  });

  it('Correctly filters by a property in the given property list', () => {
    const { result } = renderHook(() => useSearch(users, ['email']));

    act(() => {
      const onSearchChange = result.current[2];

      onSearchChange('@example.com');
    });

    const [filteredUsers] = result.current;

    // Only expect first and third user to be included
    expect(filteredUsers.length).toBe(2);
    expect(filteredUsers[0].id).toBe(1);
    expect(filteredUsers[1].id).toBe(3);
  });

  it('Does not filter by a property not in the given property list', () => {
    const { result } = renderHook(() => useSearch(users, ['name']));

    act(() => {
      const onSearchChange = result.current[2];

      onSearchChange('@example.com');
    });

    const [filteredUsers] = result.current;

    expect(filteredUsers.length).toBe(0);
  });

  it('Correctly filters by a predicate', () => {
    // Always includes first item
    // Also includes exact matches for name
    const { result } = renderHook(() => useSearch(users, (searchValue, user, index) => {
      if (index === 0) {
        return true;
      }

      return searchValue === user.name;
    }));

    act(() => {
      const onSearchChange = result.current[2];

      onSearchChange('GitHub User');
    });

    const [filteredUsers] = result.current;

    expect(filteredUsers.length).toBe(2);
    expect(filteredUsers[0].id).toBe(1);
    expect(filteredUsers[1].id).toBe(2);
  });
});
