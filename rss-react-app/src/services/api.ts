export interface Character {
  name: string;
  height: number;
  mass: number;
}

export const fetchCharacters = async (
  searchInput?: string
): Promise<Character[]> => {
  let apiUrl = 'https://swapi.dev/api/people/';

  if (searchInput && searchInput.trim() !== '') {
    apiUrl += `?search=${encodeURIComponent(searchInput.trim())}`;
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
    return data.results.map((character: Character) => ({
      name: character.name,
      height: character.height,
      mass: character.mass,
    }));
  } else {
    throw new Error('No results found');
  }
};
