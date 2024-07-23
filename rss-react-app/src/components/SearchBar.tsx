import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import '../styles/SearchBar.css';

const SearchBar = ({
  onSearch,
}: {
  onSearch: (searchInput: string, showError: boolean) => void;
}) => {
  const { storedValue, setValue } = useLocalStorage('searchInput', '');

  const [searchInput, setSearchInput] = useState<string>(storedValue);
  const [showError, setShowError] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = () => {
    const trimmedSearchInput = searchInput.trim();
    setValue(trimmedSearchInput);
    onSearch(trimmedSearchInput, showError);
  };

  const throwError = () => {
    if (!showError) {
      setShowError(true);
    }
  };

  if (showError) {
    throw new Error('This is a test error thrown by user');
  }

  return (
    <div className="SearchBar">
      <input
        type="text"
        name="searchInput"
        value={searchInput}
        onChange={handleChange}
      />
      <button onClick={handleSearch}>Search</button>
      <button className="errorBtn" onClick={throwError}>
        Throw Error
      </button>
    </div>
  );
};

export default SearchBar;
