import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Character } from '../types/interfaces';
import { transformResponse } from './transformResponse';

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
      transformResponse,
    }),
  }),
});

export const { useFetchCharactersQuery } = api;
