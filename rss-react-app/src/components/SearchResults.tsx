import { Component } from 'react';
import { Character } from '../services/api';
import '../css/SearchResults.css';

interface SearchResultsProps {
  results: Character[];
}

class SearchResults extends Component<SearchResultsProps> {
  render() {
    const { results } = this.props;

    return (
      <div className="SearchResults">
        {results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <div className="cardsContainer">
            {results.map((result, index) => (
              <div className="card" key={`${result.name}-${index}`}>
                <h3>{result.name}</h3>
                <p>height: {result.height}</p>
                <p>mass: {result.mass}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default SearchResults;
