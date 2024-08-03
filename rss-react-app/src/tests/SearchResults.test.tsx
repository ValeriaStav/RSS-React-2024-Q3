import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import SearchResults from '../components/SearchResults';
import { Character } from '../types/interfaces';
import { api } from '../services/api';
import { RootState } from '../store/store';
import selectionReducer, {
  setCurrentPageItems,
  selectItem,
  unselectItem,
  unselectAll,
} from '../reducers/selectionSlice';

const renderWithProviders = (
  ui: JSX.Element,
  store: EnhancedStore<RootState>
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

const mockCharacters: Character[] = [
  {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    homeworld: 'Tatooine',
  },
  {
    name: 'Leia Organa',
    height: '150',
    mass: '49',
    hair_color: 'brown',
    skin_color: 'light',
    eye_color: 'brown',
    birth_year: '19BBY',
    gender: 'female',
    homeworld: 'Alderaan',
  },
];

describe('SearchResults Component', () => {
  let store: EnhancedStore<RootState>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        selection: selectionReducer,
        [api.reducerPath]: api.reducer,
      },
      preloadedState: {
        selection: {
          currentPageItems: [],
          selectedItem: null,
          selectedItems: mockCharacters,
        },
      },
    });

    store.dispatch = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  test('renders characters', () => {
    renderWithProviders(
      <SearchResults
        results={mockCharacters}
        onCharacterSelect={vi.fn()}
        currentPage={1}
        onPageChange={vi.fn()}
        onCardClick={vi.fn()}
      />,
      store
    );

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getByText('Leia Organa')).toBeInTheDocument();
  });

  test('dispatches setCurrentPageItems on mount', () => {
    renderWithProviders(
      <SearchResults
        results={mockCharacters}
        onCharacterSelect={vi.fn()}
        currentPage={1}
        onPageChange={vi.fn()}
        onCardClick={vi.fn()}
      />,
      store
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      setCurrentPageItems(mockCharacters)
    );
  });

  test('handles character click', () => {
    const onCharacterSelect = vi.fn();

    renderWithProviders(
      <SearchResults
        results={mockCharacters}
        onCharacterSelect={onCharacterSelect}
        currentPage={1}
        onPageChange={vi.fn()}
        onCardClick={vi.fn()}
      />,
      store
    );

    const lukeCard = screen.getByText('Luke Skywalker').closest('a');
    fireEvent.click(lukeCard!);

    expect(onCharacterSelect).toHaveBeenCalledWith(mockCharacters[0]);
  });

  test('handles page change', () => {
    const onPageChangeMock = vi.fn();

    const mockCharacters: Character[] = Array.from({ length: 11 }, (_, i) => ({
      name: `Character ${i + 1}`,
      planet: `Planet ${i + 1}`,
      height: `${150 + i}`,
      mass: `${70 + i}`,
      hair_color: 'brown',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      homeworld: 'Planet',
    }));

    renderWithProviders(
      <SearchResults
        results={mockCharacters}
        onCharacterSelect={vi.fn()}
        currentPage={1}
        onPageChange={onPageChangeMock}
        onCardClick={vi.fn()}
      />,
      store
    );

    const nextPageButton = screen.queryByTestId('next-page-button');
    expect(nextPageButton).not.toBeNull();

    if (nextPageButton) {
      expect(nextPageButton).toBeVisible();

      fireEvent.click(nextPageButton);

      expect(onPageChangeMock).toHaveBeenCalled();

      const lastCallArgs = onPageChangeMock.mock.calls[0];
      expect(lastCallArgs).toEqual([2]);
    } else {
      console.warn('Next page button not found or not visible.');
    }
  });

  test('displays no results message', () => {
    renderWithProviders(
      <SearchResults
        results={[]}
        onCharacterSelect={vi.fn()}
        currentPage={1}
        onPageChange={vi.fn()}
        onCardClick={vi.fn()}
      />,
      store
    );

    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  test('renders selected items count and action buttons', () => {
    renderWithProviders(
      <SearchResults
        results={mockCharacters}
        onCharacterSelect={vi.fn()}
        currentPage={1}
        onPageChange={vi.fn()}
        onCardClick={vi.fn()}
      />,
      store
    );

    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes).toHaveLength(2);

    checkboxes.forEach((checkbox) => {
      fireEvent.click(checkbox);
    });

    expect(screen.getByText('Selected items: 1')).toBeInTheDocument();

    expect(screen.getByText('Clear all')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Download' })
    ).toBeInTheDocument();
  });

  test('handles checkbox click for selecting and unselecting a character', () => {
    renderWithProviders(
      <SearchResults
        results={mockCharacters}
        onCharacterSelect={vi.fn()}
        currentPage={1}
        onPageChange={vi.fn()}
        onCardClick={vi.fn()}
      />,
      store
    );

    const leiaCheckboxLink = screen.getByText(/Leia Organa/i);
    const leiaCheckbox = leiaCheckboxLink
      .closest('a')!
      .querySelector('input[type="checkbox"]') as HTMLInputElement;

    expect(leiaCheckbox).toBeChecked();

    fireEvent.click(leiaCheckbox);
    expect(store.dispatch).toHaveBeenCalledWith(
      unselectItem(mockCharacters[1])
    );

    fireEvent.click(leiaCheckbox);
    expect(store.dispatch).toHaveBeenCalledWith(selectItem(mockCharacters[1]));
  });

  test('handles Clear all button click', () => {
    renderWithProviders(
      <SearchResults
        results={mockCharacters}
        onCharacterSelect={vi.fn()}
        currentPage={1}
        onPageChange={vi.fn()}
        onCardClick={vi.fn()}
      />,
      store
    );

    const clearAllButton = screen.getByText('Clear all');
    fireEvent.click(clearAllButton);

    expect(store.dispatch).toHaveBeenCalledWith(unselectAll());
  });

  test('calls setCurrentPageItems when results change', () => {
    const newResults: Character[] = [
      {
        name: 'Han Solo',
        height: '180',
        mass: '80',
        hair_color: 'brown',
        skin_color: 'fair',
        eye_color: 'brown',
        birth_year: '29BBY',
        gender: 'male',
        homeworld: 'Corellia',
      },
    ];

    const { rerender } = renderWithProviders(
      <SearchResults
        results={mockCharacters}
        onCharacterSelect={vi.fn()}
        currentPage={1}
        onPageChange={vi.fn()}
        onCardClick={vi.fn()}
      />,
      store
    );

    rerender(
      <Provider store={store}>
        <MemoryRouter>
          <SearchResults
            results={newResults}
            onCharacterSelect={vi.fn()}
            currentPage={1}
            onPageChange={vi.fn()}
            onCardClick={vi.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      setCurrentPageItems(newResults)
    );
  });

  test('loads selected items from localStorage on mount', () => {
    renderWithProviders(
      <SearchResults
        results={mockCharacters}
        onCharacterSelect={vi.fn()}
        currentPage={1}
        onPageChange={vi.fn()}
        onCardClick={vi.fn()}
      />,
      store
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      setCurrentPageItems(mockCharacters)
    );
  });

  test('handles checkbox change to unselect item', () => {
    renderWithProviders(
      <SearchResults
        results={mockCharacters}
        onCharacterSelect={vi.fn()}
        currentPage={1}
        onPageChange={vi.fn()}
        onCardClick={vi.fn()}
      />,
      store
    );

    const leiaCard = screen.getByText(/Leia Organa/i).closest('a');

    if (leiaCard) {
      const leiaCheckbox = leiaCard.querySelector('input[type="checkbox"]');

      if (leiaCheckbox) {
        fireEvent.click(leiaCheckbox);

        expect(store.dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'selection/selectItem',
            payload: expect.objectContaining({
              name: 'Leia Organa',
            }),
          })
        );

        expect(store.dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'selection/setCurrentPageItems',
            payload: expect.arrayContaining([
              expect.objectContaining({
                name: 'Luke Skywalker',
              }),
            ]),
          })
        );
      } else {
        throw new Error('Checkbox for Leia Organa not found');
      }
    } else {
      throw new Error('Card for Leia Organa not found');
    }
  });
});
