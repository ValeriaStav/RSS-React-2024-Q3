import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Character } from '../types/interfaces';

interface SelectionState {
  currentPageItems: Character[];
  selectedItem: Character | null;
  selectedItems: Character[];
}

const initialState: SelectionState = {
  currentPageItems: [],
  selectedItem: null,
  selectedItems: [],
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    setCurrentPageItems: (state, action: PayloadAction<Character[]>) => {
      state.currentPageItems = action.payload;
    },
    selectItem: (state, action: PayloadAction<Character>) => {
      state.selectedItem = action.payload;
      state.selectedItems.push(action.payload);
    },
    unselectItem: (state, action: PayloadAction<Character>) => {
      state.selectedItems = state.selectedItems.filter(
        (item) => item.name !== action.payload.name
      );
      if (state.selectedItem?.name === action.payload.name) {
        state.selectedItem = null;
      }
    },
    unselectAll: (state) => {
      state.selectedItems = [];
      state.selectedItem = null;
    },
  },
});

export const { setCurrentPageItems, selectItem, unselectItem, unselectAll } =
  selectionSlice.actions;
export default selectionSlice.reducer;
