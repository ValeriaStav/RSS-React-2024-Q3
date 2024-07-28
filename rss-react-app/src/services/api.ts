import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Character } from '../types/interfaces';

const homeworldCache: { [url: string]: string } = {};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://swapi.dev/api/' }),
  endpoints: (builder) => ({
    fetchCharacters: builder.query<
      Character[],
      { page: number; search?: string }
    >({
      query: ({ page, search }) => {
        let url = `people/?page=${page}`;
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        return url;
      },
      transformResponse: async (response: { results: Character[] }) => {
        const characters: Character[] = await Promise.all(
          response.results.map(async (character: Character) => {
            if (!homeworldCache[character.homeworld]) {
              try {
                const homeworldResponse = await fetch(character.homeworld);
                if (!homeworldResponse.ok) {
                  throw new Error('Failed to fetch homeworld data');
                }
                const homeworldData = await homeworldResponse.json();
                homeworldCache[character.homeworld] = homeworldData.name;
              } catch (error) {
                console.error(
                  `Failed to fetch homeworld for ${character.name}:`,
                  error
                );
                homeworldCache[character.homeworld] = 'Unknown';
              }
            }
            return {
              ...character,
              homeworld: homeworldCache[character.homeworld],
            };
          })
        );
        return characters;
      },
    }),
  }),
});

export const { useFetchCharactersQuery } = api;
