import React, { useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import useLocalStorage from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';
import '../styles/SearchBar.css';

const SearchBar = ({
  onSearch,
}: {
  onSearch: (searchInput: string, showError: boolean) => void;
}) => {
  const { storedValue, setValue } = useLocalStorage('searchInput', '');
  const { theme, toggleTheme } = useTheme();

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
      <button className="searchBtn" onClick={handleSearch}>
        Search
      </button>
      <div className="button-container">
        <button className="themeToggle" onClick={toggleTheme}>
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </button>
        <button className="errorBtn" onClick={throwError}>
          Throw Error
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
