import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { ThemeProvider } from '../context/ThemeContext';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { vi } from 'vitest';
import { api, useFetchCharactersQuery } from '../services/api';

vi.mock('../services/api', async (importOriginal) => {
  const actual = await importOriginal<typeof api>();
  return {
    ...actual,
    useFetchCharactersQuery: vi.fn(),
  };
});

describe('App Component', () => {
  const renderApp = (route = '/') =>
    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={[route]}>
            <App />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

  beforeEach(() => {
    (
      useFetchCharactersQuery as jest.MockedFunction<
        typeof useFetchCharactersQuery
      >
    ).mockReturnValue({
      data: [
        { name: 'Rick Sanchez', homeworld: 'Earth' },
        { name: 'Morty Smith', homeworld: 'Earth' },
      ],
      isLoading: false,
      refetch: vi.fn(),
      error: null,
    });
  });

  test('renders the search bar', () => {
    renderApp();
    expect(screen.getByText(/search/i)).toBeInTheDocument();
  });

  test('handles theme toggling', () => {
    renderApp();
    const button = screen.getByText(/Switch to dark theme/i);
    fireEvent.click(button);
    expect(screen.getByText(/Switch to light theme/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Switch to light theme/i));
    expect(screen.getByText(/Switch to dark theme/i)).toBeInTheDocument();
  });

  test('shows loading indicator when fetching characters', () => {
    (
      useFetchCharactersQuery as jest.MockedFunction<
        typeof useFetchCharactersQuery
      >
    ).mockReturnValueOnce({
      data: null,
      isLoading: true,
      refetch: vi.fn(),
      error: null,
    });

    (
      useFetchCharactersQuery as jest.MockedFunction<
        typeof useFetchCharactersQuery
      >
    ).mockReturnValueOnce({
      data: null,
      isLoading: true,
      refetch: vi.fn(),
      error: null,
    });
    renderApp();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('displays search results', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
      expect(screen.getByText(/Morty Smith/i)).toBeInTheDocument();
    });
  });

  test('handles character selection', async () => {
    renderApp();
    const character = await screen.findByText(/Rick Sanchez/i);
    fireEvent.click(character);
    await waitFor(() => {
      const element = screen.getByText(/Close/i);
      expect(element).toHaveClass('closeBtn');
    });
  });
});
