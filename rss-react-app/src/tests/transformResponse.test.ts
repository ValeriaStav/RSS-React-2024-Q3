import {
  transformResponse,
  homeworldCache,
} from '../services/transformResponse';
import { Character } from '../types/interfaces';
import { vi } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const character: Character = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  homeworld: 'https://swapi.dev/api/planets/1/',
};

const homeworldData = { name: 'Tatooine' };

beforeEach(() => {
  mockFetch.mockClear();
  for (const key in homeworldCache) {
    delete homeworldCache[key];
  }
});

describe('transformResponse Component', () => {
  test('correctly transforms character data with successful homeworld fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => homeworldData,
    });

    const response = { results: [character] };
    const transformedCharacters = await transformResponse(response);

    expect(transformedCharacters).toEqual([
      {
        ...character,
        homeworld: 'Tatooine',
      },
    ]);
  });

  test('handles failed homeworld fetch', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    const response = { results: [character] };
    const transformedCharacters = await transformResponse(response);

    expect(transformedCharacters).toEqual([
      {
        ...character,
        homeworld: 'Unknown',
      },
    ]);
  });

  test('handles non-ok homeworld fetch response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const response = { results: [character] };
    const transformedCharacters = await transformResponse(response);

    expect(transformedCharacters).toEqual([
      {
        ...character,
        homeworld: 'Unknown',
      },
    ]);
  });
});
