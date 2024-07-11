import { Component } from 'react';
import '../css/SearchResults.css';

interface Character {
  name: string;
}

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
          <div>
            {results.map((result, index) => (
              <div key={`${result.name}-${index}`}>
                <p>
                  {index + 1}. {result.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default SearchResults;
