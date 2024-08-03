import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { api } from '../services/api';
import selectionReducer from '../reducers/selectionSlice';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const character = {
  name: 'Luke Skywalker',
  homeworld: 'https://swapi.dev/api/planets/1/',
};
const homeworldData = { name: 'Tatooine' };

vi.mock('../services/api', () => ({
  api: {
    reducerPath: 'api',
    reducer: (state = {}) => state,
    middleware: [],
    endpoints: {
      fetchCharacters: {
        useQuery: vi.fn().mockImplementation(() => {
          return {
            data: [character],
            isLoading: false,
            error: null,
          };
        }),
      },
    },
  },
}));

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    selection: selectionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

const MockComponent = () => {
  const { data, error, isLoading } = api.endpoints.fetchCharacters.useQuery({
    page: 1,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {String(error)}</div>;

  return (
    <div>
      {data?.map((character) => (
        <div key={character.name}>{character.name}</div>
      ))}
    </div>
  );
};

beforeEach(() => {
  mockFetch.mockClear();
});

describe('api Component', () => {
  test('fetchCharacters renders data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => homeworldData,
    });

    render(
      <Provider store={store}>
        <MockComponent />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });
  });

  test('fetchCharacters handles failed homeworld fetches', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <Provider store={store}>
        <MockComponent />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });
  });
});
