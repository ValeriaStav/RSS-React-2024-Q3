import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import ErrorBoundary from './components/ErrorBoundary';
import DetailedCard from './components/DetailedCard';
import { Character } from './types/interfaces';
import { useFetchCharactersQuery } from './services/api';
import { useTheme } from './hooks/useTheme';
import './styles/App.css';

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchResults, setSearchResults] = useState<Character[]>([]);
  const [isDetailedLoading, setIsDetailedLoading] = useState(false);
  const [searchedOnce, setSearchedOnce] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const savedSearchInput = localStorage.getItem('searchInput') || '';
  const page = parseInt(params.get('page') || '1', 10);
  const details = params.get('details');

  const { data: results, isLoading } = useFetchCharactersQuery({
    page,
    search: searchInput || undefined,
  });

  useEffect(() => {
    setCurrentPage(page);

    if (savedSearchInput && !searchedOnce) {
      setSearchInput(savedSearchInput);
      setSearchedOnce(true);
    } else if (!searchInput) {
      setSearchInput('');
    }
  }, [location.search, searchedOnce, searchInput]);

  useEffect(() => {
    if (results) {
      setSearchResults(results);
      if (details) {
        const character = results.find((c) => c.name === details);
        setSelectedCharacter(character || null);
      }
    }
  }, [results, details]);

  const handleSearch = (searchInput: string) => {
    localStorage.setItem('searchInput', searchInput);
    setSearchInput(searchInput);
    setSearchedOnce(true);
    navigate(`/RSS-React-2024-Q3/?page=1`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      <div
        className={`App ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
      >
        <SearchBar onSearch={handleSearch} />
        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'dark' : 'light'} theme
        </button>
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
