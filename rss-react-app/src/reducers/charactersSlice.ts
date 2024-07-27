import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Character } from '../types/interfaces';

interface CharactersState {
  items: Character[];
  selectedItems: Character[];
  loading: boolean;
  error: string | null;
}

const initialState: CharactersState = {
  items: [],
  selectedItems: [],
  loading: false,
  error: null,
};

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setCharacters: (state, action: PayloadAction<Character[]>) => {
      state.items = action.payload;
    },
    addSelectedItem: (state, action: PayloadAction<Character>) => {
      state.selectedItems.push(action.payload);
    },
    removeSelectedItem: (state, action: PayloadAction<string>) => {
      state.selectedItems = state.selectedItems.filter(
        (item) => item.name !== action.payload
      );
    },
    unselectAllItems: (state) => {
      state.selectedItems = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCharacters,
  addSelectedItem,
  removeSelectedItem,
  unselectAllItems,
  setLoading,
  setError,
} = charactersSlice.actions;

export default charactersSlice.reducer;
