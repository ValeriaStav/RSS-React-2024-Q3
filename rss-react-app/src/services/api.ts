import { Character } from '../components/interfaces';

export const fetchCharacters = async (
  searchInput?: string,
  page: number = 1
): Promise<Character[]> => {
  let apiUrl = `https://swapi.dev/api/people/?page=${page}`;

  if (searchInput && searchInput.trim() !== '') {
    apiUrl += `&search=${encodeURIComponent(searchInput.trim())}`;
  }

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
        const homeworldResponse = await fetch(character.homeworld);
        if (!homeworldResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        const homeworldData = await homeworldResponse.json();
        return {
          name: character.name,
          height: character.height,
          mass: character.mass,
          hair_color: character.hair_color,
          skin_color: character.skin_color,
          eye_color: character.eye_color,
          birth_year: character.birth_year,
          gender: character.gender,
          homeworld: homeworldData.name,
        };
      })
    );
    return characters;
  } else {
    throw new Error('No results found');
  }
};
