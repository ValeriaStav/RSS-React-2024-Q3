import React from 'react';
import '@testing-library/jest-dom';
import { describe, it, vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Character, SearchResultsProps } from '../types/interfaces';
import SearchResults from '../components/SearchResults';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createCharacter = (
  name: string,
  homeworld: string = 'Tatooine'
): Character => ({
  name,
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  homeworld,
});

describe('SearchResults Component', () => {
  const setup = (props: Partial<SearchResultsProps> = {}) => {
    const defaultProps: SearchResultsProps = {
      results: [],
      onCharacterSelect: vi.fn(),
      currentPage: 1,
      onPageChange: vi.fn(),
      onCardClick: vi.fn(),
      ...props,
    };

    return render(
      <Router>
        <SearchResults {...defaultProps} />
      </Router>
    );
  };

  it('renders "No results found." when results are empty', () => {
    setup();
    expect(screen.getByText(/No results found./i)).toBeInTheDocument();
  });

  it('renders characters when results are not empty', () => {
    const results = [
      createCharacter('Luke Skywalker'),
      createCharacter('Darth Vader'),
    ];
    setup({ results });
    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    expect(screen.getByText(/Darth Vader/i)).toBeInTheDocument();
  });

  it('calls onCharacterSelect and navigates on character click', () => {
    const results = [createCharacter('Luke Skywalker')];
    const onCharacterSelect = vi.fn();
    setup({ results, onCharacterSelect, currentPage: 2 });

    const characterLink = screen.getByText(/Luke Skywalker/i).closest('a');
    if (characterLink) {
      fireEvent.click(characterLink);
      expect(onCharacterSelect).toHaveBeenCalledWith(results[0]);
      expect(mockNavigate).toHaveBeenCalledWith(
        '?page=2&details=Luke Skywalker'
      );
    }
  });

  it('navigates to the previous page when the previous button is clicked', () => {
    const onPageChange = vi.fn();
    setup({ currentPage: 2, onPageChange });

    const prevButton = screen.getByTestId('prev-page-button');
    fireEvent.click(prevButton);
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(mockNavigate).toHaveBeenCalledWith('?page=1');
  });

  it('navigates to the next page when the next button is clicked', () => {
    const results = Array.from({ length: 10 }, () =>
      createCharacter('Test Character')
    );
    const onPageChange = vi.fn();
    setup({ results, currentPage: 1, onPageChange });

    const nextButton = screen.getByTestId('next-page-button');
    fireEvent.click(nextButton);
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(mockNavigate).toHaveBeenCalledWith('?page=2');
  });

  it('disables the previous button on the first page', () => {
    setup({ currentPage: 1 });
    const prevButton = screen.getByTestId('prev-page-button');
    expect(prevButton).toHaveAttribute('aria-disabled', 'true');
    expect(prevButton).toHaveClass('disabled');
  });

  it('disables the next button if there are less than 10 results', () => {
    const results = [createCharacter('Luke Skywalker')];
    setup({ results, currentPage: 1 });

    const nextButton = screen.getByTestId('next-page-button');
    expect(nextButton).toHaveAttribute('aria-disabled', 'true');
    expect(nextButton).toHaveClass('disabled');
  });
});
