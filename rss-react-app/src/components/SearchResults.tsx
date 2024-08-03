import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  selectItem,
  unselectItem,
  unselectAll,
  setCurrentPageItems,
} from '../reducers/selectionSlice';
import { Character, SearchResultsProps } from '../types/interfaces';
import useLocalStorage from '../hooks/useLocalStorage';
import '../styles/SearchResults.css';

const SearchResults = ({
  results,
  onCharacterSelect,
  currentPage,
  onPageChange,
  onCardClick,
}: SearchResultsProps) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { storedValue: selectedItems, setValue: setSelectedItems } =
    useLocalStorage<Character[]>('selectedItems', []);
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    dispatch(setCurrentPageItems(results));
  }, [results, dispatch]);

  useEffect(() => {
    selectedItems.forEach((item) => {
      dispatch(selectItem(item));
    });
  }, [dispatch, selectedItems]);

  const handleCharacterClick = (
    character: Character,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    setSelectedCharacter(character);
    onCharacterSelect(character);
    navigate(`?page=${currentPage}&details=${character.name}`);
    if (isSelected(character)) {
      const newSelectedItems = selectedItems.filter(
        (item) => item.name !== character.name
      );
      dispatch(unselectItem(character));
      setSelectedItems(newSelectedItems);
    } else {
      const newSelectedItems = [...selectedItems, character];
      dispatch(selectItem(character));
      setSelectedItems(newSelectedItems);
    }
  };

  const handleCheckboxChange = (character: Character) => {
    if (isSelected(character)) {
      const newSelectedItems = selectedItems.filter(
        (item) => item.name !== character.name
      );
      dispatch(unselectItem(character));
      setSelectedItems(newSelectedItems);
    } else {
      const newSelectedItems = [...selectedItems, character];
      dispatch(selectItem(character));
      setSelectedItems(newSelectedItems);
    }
  };

  const isSelected = (character: Character) => {
    return selectedItems.some((item) => item.name === character.name);
  };

  const handlePageChange = (
    event: React.MouseEvent<HTMLAnchorElement>,
    page: number
  ) => {
    event.preventDefault();
    onPageChange(page);
    navigate(`?page=${page}`);
  };

  const handleClearSelection = () => {
    dispatch(unselectAll());
    setSelectedItems([]);
  };

  const handleExportCSV = () => {
    const csvContent = selectedItems
      .map(
        (item) =>
          `name: ${item.name}, planet: ${item.homeworld}, birth: ${item.birth_year}, gender: ${item.gender}`
      )
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = `${selectedItems.length}_selected_items.csv`;

    if (linkRef.current) {
      linkRef.current.href = URL.createObjectURL(blob);
      linkRef.current.download = filename;
      linkRef.current.click();
    }
  };

  return (
    <div className="SearchResults">
      <div className="selection-info">
        <span>Selected items: {selectedItems.length}</span>
        {selectedItems.length > 0 && (
          <div className="selection-popup">
            <span>Selected {selectedItems.length} items</span>
            <button onClick={handleClearSelection}>Clear all</button>
            <button onClick={handleExportCSV}>Download</button>
            <a ref={linkRef} style={{ display: 'none' }}>
              Download
            </a>
          </div>
        )}
      </div>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="cardsContainer">
          {results.map((result, index) => (
            <Link
              key={`${result.name}-${index}`}
              className={`card ${selectedCharacter === result ? 'selected' : ''}`}
              to={`?page=${currentPage}/details/${result.name}`}
              onClick={(e) => {
                e.stopPropagation();
                handleCharacterClick(result, e);
                if (onCardClick) {
                  onCardClick(e);
                }
              }}
            >
              <div>
                <h3>{result.name}</h3>
                <h4>Planet: {result.homeworld}</h4>
              </div>
              <input
                type="checkbox"
                checked={isSelected(result)}
                onChange={() => handleCheckboxChange(result)}
                onClick={(e) => e.stopPropagation()}
              />
            </Link>
          ))}
        </div>
      )}
      <div className="pagination">
        <a
          href="#"
          onClick={(event) => {
            if (currentPage !== 1) {
              handlePageChange(event, currentPage - 1);
            }
          }}
          role="button"
          aria-disabled={currentPage === 1 ? 'true' : 'false'}
          className={currentPage === 1 ? 'disabled' : ''}
          data-testid="prev-page-button"
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
        </a>
        <a
          href="#"
          onClick={(event) => {
            if (results.length >= 9) {
              handlePageChange(event, currentPage - 1);
            }
          }}
          role="button"
          aria-disabled={currentPage === 1 ? 'true' : 'false'}
          className={currentPage === 1 ? 'disabled' : ''}
          style={{ display: currentPage === 1 ? 'none' : 'inline' }}
        >
          {currentPage - 1}
        </a>
        <span>{currentPage}</span>
        <a
          href="#"
          onClick={(event) => {
            if (results.length === 10) {
              handlePageChange(event, currentPage + 1);
            }
          }}
          role="button"
          aria-disabled={results.length < 10 ? 'true' : 'false'}
          className={results.length < 10 ? 'disabled' : ''}
          style={{
            display: results.length < 10 ? 'none' : 'inline',
          }}
        >
          {currentPage + 1}
        </a>
        <a
          href="#"
          onClick={(event) => {
            if (results.length >= 9) {
              handlePageChange(event, currentPage + 1);
            }
          }}
          role="button"
          aria-disabled={results.length < 10 ? 'true' : 'false'}
          className={results.length < 10 ? 'disabled' : ''}
          data-testid="next-page-button"
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
        </a>
      </div>
    </div>
  );
};

export default SearchResults;
