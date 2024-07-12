import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import ErrorBoundary from './components/ErrorBoundary';
import { Character, fetchCharacters } from './services/api';
import './css/App.css';

const App = () => {
  const [searchResults, setSearchResults] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchedOnce, setSearchedOnce] = useState(false);

  useEffect(() => {
    const savedSearchInput = localStorage.getItem('searchInput');
    savedSearchInput && !searchedOnce
      ? fetchCharactersData(savedSearchInput)
      : fetchCharactersData();
  }, [searchedOnce]);

  const fetchCharactersData = async (searchInput?: string) => {
    setIsLoading(true);

    try {
      const results = await fetchCharacters(searchInput);
      setSearchResults(results);
      setIsLoading(false);
      setSearchedOnce(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setIsLoading(false);
    }
  };

  const handleSearch = (searchInput: string) => {
    fetchCharactersData(searchInput);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <SearchBar onSearch={handleSearch} />
        {isLoading ? (
          <div className="load">Loading...</div>
        ) : (
          <SearchResults results={searchResults} />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
