import { Component } from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import ErrorBoundary from './components/ErrorBoundary';
import { Character, fetchCharacters } from './services/api';
import './css/App.css';

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

  fetchCharacters = async (searchInput?: string): Promise<void> => {
    this.setState({ isLoading: true });

    try {
      const results = await fetchCharacters(searchInput);
      this.setState({
        searchResults: results,
        isLoading: false,
        searchedOnce: true,
      });
    } catch (error) {
      console.error('Error fetching search results:', error);
      this.setState({ isLoading: false, showError: true });
    }
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
