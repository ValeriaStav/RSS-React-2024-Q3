import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import ErrorBoundary from './components/ErrorBoundary';
import DetailedCard from './components/DetailedCard';
import { Character } from './types/interfaces';
import { fetchCharacters } from './services/api';
import './styles/App.css';

const App = () => {
  const [searchResults, setSearchResults] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailedLoading, setIsDetailedLoading] = useState(false);
  const [searchedOnce, setSearchedOnce] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const location = useLocation();
  const navigate = useNavigate();
  const cache = useRef<{ [key: string]: Character[] }>({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const savedSearchInput = localStorage.getItem('searchInput');
    const page = parseInt(params.get('page') || '1', 10);
    const details = params.get('details');

    setCurrentPage(page);

    if (savedSearchInput && !searchedOnce) {
      setSearchInput(savedSearchInput);
      fetchCharactersData(savedSearchInput, page, details);
    } else if (searchInput) {
      fetchCharactersData(searchInput, page, details);
    } else {
      fetchCharactersData('', page, details);
    }
  }, [location.search, searchedOnce, searchInput]);

  const fetchCharactersData = async (
    searchInput?: string,
    page: number = 1,
    details?: string | null
  ) => {
    const cacheKey = `${searchInput || 'all'}_${page}`;
    if (cache.current[cacheKey]) {
      setSearchResults(cache.current[cacheKey]);
      if (details) {
        const character = cache.current[cacheKey].find(
          (c) => c.name === details
        );
        setSelectedCharacter(character || null);
      }
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await fetchCharacters(searchInput, page);
      cache.current[cacheKey] = results;
      setSearchResults(results);
      if (details) {
        const character = results.find((c) => c.name === details);
        setSelectedCharacter(character || null);
      }
      setIsLoading(false);
      setSearchedOnce(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setIsLoading(false);
    }
  };

  const handleSearch = (searchInput: string) => {
    localStorage.setItem('searchInput', searchInput);
    setSearchInput(searchInput);
    fetchCharactersData(searchInput, 1);
    navigate(`/RSS-React-2024-Q3/?page=1`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCharactersData(searchInput || undefined, page);
    navigate(`/RSS-React-2024-Q3/?page=${page}`);
  };

  const handleCharacterSelect = (character: Character) => {
    setIsDetailedLoading(true);
    setSelectedCharacter(character);
    navigate(
      `/RSS-React-2024-Q3/?page=${currentPage}&details=${character.name}`
    );

    setTimeout(() => {
      setIsDetailedLoading(false);
    }, 1000);
  };

  const handleCloseDetails = () => {
    setSelectedCharacter(null);
    navigate(`/RSS-React-2024-Q3/?page=${currentPage}`);
  };

  const handleLeftSectionClick = () => {
    if (selectedCharacter) {
      handleCloseDetails();
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <SearchBar onSearch={handleSearch} />
        {isLoading ? (
          <div className="load">Loading...</div>
        ) : (
          <div className="content">
            <div className="left-section" onClick={handleLeftSectionClick}>
              <SearchResults
                results={searchResults}
                onCharacterSelect={handleCharacterSelect}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onCardClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="right-section">
              {isDetailedLoading ? (
                <div className="load">Loading...</div>
              ) : (
                selectedCharacter && (
                  <DetailedCard
                    character={selectedCharacter}
                    onClose={handleCloseDetails}
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
