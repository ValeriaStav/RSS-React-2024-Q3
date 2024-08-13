import { Character } from '../types/interfaces';

export const homeworldCache: { [url: string]: string } = {};

export const transformResponse = async (response: {
  results: Character[];
}): Promise<Character[]> => {
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
};
