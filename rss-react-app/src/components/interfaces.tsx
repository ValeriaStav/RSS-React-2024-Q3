import { ReactNode } from 'react';

export interface Character {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
}

export interface SearchBarProps {
  onSearch: (searchInput: string) => void;
}

export interface SearchResultsProps {
  results: Character[];
  onCharacterSelect: (character: Character) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  onCardClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export interface DetailedCardProps {
  character: Character | null;
  onClose: () => void;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}
