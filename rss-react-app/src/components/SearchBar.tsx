import React, { Component } from 'react';

class SearchBar extends Component<{ onSearch: (searchInput: string) => void }> {
  state = {
    searchInput: '',
  };

  componentDidMount() {
    const savedSearchInput = localStorage.getItem('searchInput');
    if (savedSearchInput) {
      this.setState({ searchInput: savedSearchInput }, () => {
        this.props.onSearch(savedSearchInput);
      });
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = event.target.value;
    this.setState({ searchInput });
    localStorage.setItem('searchInput', searchInput);
  };

  handleSearch = () => {
    const { searchInput } = this.state;
    const trimmedSearchInput = searchInput.trim();
    this.props.onSearch(trimmedSearchInput);
    localStorage.setItem('searchInput', trimmedSearchInput);
  };

  render() {
    return (
      <div className="SearchBar">
        <input
          type="text"
          name="searchInput"
          value={this.state.searchInput}
          onChange={this.handleChange}
        />
        <button onClick={this.handleSearch}>Search</button>
      </div>
    );
  }
}

export default SearchBar;
