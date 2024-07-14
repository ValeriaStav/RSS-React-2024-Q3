import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Character, SearchResultsProps } from './interfaces';
import '../css/SearchResults.css';

const SearchResults = ({
  results,
  onCharacterSelect,
  currentPage,
  onPageChange,
}: SearchResultsProps) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const navigate = useNavigate();

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
    onCharacterSelect(character);
    navigate(`?page=${currentPage}&details=${character.name}`);
  };

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement>,
    page: number
  ) => {
    event.preventDefault();
    onPageChange(page);
    navigate(`?page=${page}`);
  };

  return (
    <div className="SearchResults">
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="cardsContainer">
          {results.map((result, index) => (
            <Link
              key={`${result.name}-${index}`}
              to={`?page=${currentPage}/details/${result.name}`}
              className={`card ${selectedCharacter === result ? 'selected' : ''}`}
              onClick={() => handleCharacterClick(result)}
            >
              <h3>{result.name}</h3>
              <h4>Planet: {result.homeworld}</h4>
            </Link>
          ))}
        </div>
      )}
      <div className="pagination">
        <button
          onClick={(event) => handlePageChange(event, currentPage - 1)}
          disabled={currentPage === 1}
        >
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="left"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
          </svg>
        </button>
        <span>{currentPage}</span>
        <button
          onClick={(event) => handlePageChange(event, currentPage + 1)}
          disabled={results.length < 10}
        >
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="right"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
