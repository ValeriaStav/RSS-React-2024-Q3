import { Character } from '../types/interfaces';

const homeworldCache: { [url: string]: string } = {};

export const fetchCharacters = async (
  searchInput?: string,
  page: number = 1
): Promise<Character[]> => {
  let apiUrl = `https://swapi.dev/api/people/?page=${page}`;

  if (searchInput && searchInput.trim() !== '') {
    apiUrl += `&search=${encodeURIComponent(searchInput.trim())}`;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.results) {
      const characters: Character[] = await Promise.all(
        data.results.map(async (character: Character) => {
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
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }
};
