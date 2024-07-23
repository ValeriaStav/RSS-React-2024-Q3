import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailedCard from '../components/DetailedCard';

describe('DetailedCard component', () => {
  const mockCharacter = {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    homeworld: 'Tatooine',
  };

  it('renders Loading... when no character is provided', () => {
    render(<DetailedCard onClose={() => {}} />);
    const loadingElement = screen.getByText(/Loading.../i);
    expect(loadingElement).toBeInTheDocument();
  });

  it('renders character details correctly', () => {
    render(<DetailedCard character={mockCharacter} onClose={() => {}} />);
    expect(screen.getByText(mockCharacter.name)).toBeInTheDocument();
    expect(
      screen.getByText(`height: ${mockCharacter.height}`)
    ).toBeInTheDocument();
    expect(screen.getByText(`mass: ${mockCharacter.mass}`)).toBeInTheDocument();
    expect(
      screen.getByText(`hair color: ${mockCharacter.hair_color}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`skin color: ${mockCharacter.skin_color}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`eye color: ${mockCharacter.eye_color}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`birth year: ${mockCharacter.birth_year}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`gender: ${mockCharacter.gender}`)
    ).toBeInTheDocument();
  });

  it('calls onClose function when Close button is clicked', () => {
    const onCloseMock = vi.fn();
    render(<DetailedCard character={mockCharacter} onClose={onCloseMock} />);
    const closeButton = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
