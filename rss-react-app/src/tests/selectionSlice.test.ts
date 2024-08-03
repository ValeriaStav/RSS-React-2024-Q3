import selectionReducer, {
  setCurrentPageItems,
  selectItem,
  unselectItem,
  unselectAll,
} from '../reducers/selectionSlice';
import { Character } from '../types/interfaces';
import { Action } from '@reduxjs/toolkit';

const mockCharacter: Character = {
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

describe('selectionSlice', () => {
  test('should return the initial state', () => {
    expect(selectionReducer(undefined, {} as Action)).toEqual({
      currentPageItems: [],
      selectedItem: null,
      selectedItems: [],
    });
  });

  test('should handle setCurrentPageItems', () => {
    const previousState = {
      currentPageItems: [],
      selectedItem: null,
      selectedItems: [],
    };

    expect(
      selectionReducer(previousState, setCurrentPageItems([mockCharacter]))
    ).toEqual({
      currentPageItems: [mockCharacter],
      selectedItem: null,
      selectedItems: [],
    });
  });

  test('should handle selectItem', () => {
    const previousState = {
      currentPageItems: [],
      selectedItem: null,
      selectedItems: [],
    };

    expect(selectionReducer(previousState, selectItem(mockCharacter))).toEqual({
      currentPageItems: [],
      selectedItem: mockCharacter,
      selectedItems: [mockCharacter],
    });
  });

  test('should handle unselectItem', () => {
    const previousState = {
      currentPageItems: [],
      selectedItem: mockCharacter,
      selectedItems: [mockCharacter],
    };

    expect(
      selectionReducer(previousState, unselectItem(mockCharacter))
    ).toEqual({
      currentPageItems: [],
      selectedItem: null,
      selectedItems: [],
    });
  });

  test('should handle unselectAll', () => {
    const previousState = {
      currentPageItems: [],
      selectedItem: mockCharacter,
      selectedItems: [mockCharacter],
    };

    expect(selectionReducer(previousState, unselectAll())).toEqual({
      currentPageItems: [],
      selectedItem: null,
      selectedItems: [],
    });
  });
});
