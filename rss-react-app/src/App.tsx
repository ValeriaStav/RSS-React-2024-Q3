import { Component } from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import ErrorBoundary from './components/ErrorBoundary';
import './css/App.css';

interface Character {
  name: string;
}

interface AppState {
  searchResults: Character[];
  isLoading: boolean;
  searchedOnce: boolean;
  showError: boolean;
}

class App extends Component<object, AppState> {
  state: AppState = {
    searchResults: [],
    isLoading: true,
    searchedOnce: false,
    showError: false,
  };

  componentDidMount() {
    const savedSearchInput = localStorage.getItem('searchInput');
    savedSearchInput && !this.state.searchedOnce
      ? this.fetchCharacters(savedSearchInput)
      : this.fetchCharacters();
  }

  fetchCharacters = (searchInput?: string): void => {
    this.setState({ isLoading: true });

    let apiUrl = 'https://stapi.co/api/v1/rest/character/search';

    if (searchInput && searchInput.trim() !== '') {
      apiUrl += `?name=${encodeURIComponent(searchInput.trim())}`;
    }

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const results = data.characters.map((character: Character) => ({
          name: character.name,
        }));
        this.setState({
          searchResults: results,
          isLoading: false,
          searchedOnce: true,
        });
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
        this.setState({ isLoading: false, showError: true });
      });
  };

  handleSearch = (searchInput: string): void => {
    this.fetchCharacters(searchInput);
  };

  render() {
    const { searchResults, isLoading } = this.state;

    return (
      <ErrorBoundary>
        <div className="App">
          <SearchBar onSearch={this.handleSearch} />
          {isLoading ? (
            <div className="load">Loading...</div>
          ) : (
            <SearchResults results={searchResults} />
          )}
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
