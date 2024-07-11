import React, { Component } from 'react';
import '../css/SearchBar.css';

class SearchBar extends Component<{
  onSearch: (searchInput: string, showError: boolean) => void;
}> {
  state = {
    searchInput: '',
    showError: false,
  };

  componentDidMount() {
    const savedSearchInput = localStorage.getItem('searchInput');
    if (savedSearchInput) {
      this.setState({ searchInput: savedSearchInput }, () => {
        this.props.onSearch(savedSearchInput, this.state.showError);
      });
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = event.target.value;
    this.setState({ searchInput });
  };

  handleSearch = () => {
    const { searchInput, showError } = this.state;
    const trimmedSearchInput = searchInput.trim();
    this.props.onSearch(trimmedSearchInput, showError);
    localStorage.setItem('searchInput', trimmedSearchInput);
  };

  throwError = () => {
    if (!this.state.showError) {
      this.setState({ showError: true });
    }
  };

  render() {
    if (this.state.showError) {
      throw new Error('This is a test error thrown by user');
    }

    return (
      <div className="SearchBar">
        <input
          type="text"
          name="searchInput"
          value={this.state.searchInput}
          onChange={this.handleChange}
        />
        <button onClick={this.handleSearch}>Search</button>
        <button className="errorBtn" onClick={this.throwError}>
          Throw Error
        </button>
      </div>
    );
  }
}

export default SearchBar;
