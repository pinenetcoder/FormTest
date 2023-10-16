import React from 'react';

import { debounce } from 'lodash';

/**
 * returns input value, and debouncing search fn, provided callback must be memoized
 * @param cb callback to fire in N ms
 * @param wait time to wait for cb to fire
 * @param initialValue initial value for search
 */
const useDebounce = (cb: (query: string) => void, wait: number, initialValue = '') => {
  const [search, setSearch] = React.useState(initialValue);

  const debounceFiltering = React.useMemo(() => debounce(cb, wait), [cb, wait]);

  const onSearch = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      debounceFiltering(e.target.value);
    },
    [debounceFiltering],
  );

  return { search, onSearch };
};

export default useDebounce;
