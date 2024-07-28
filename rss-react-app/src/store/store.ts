import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';
import selectionReducer from '../reducers/selectionSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    selection: selectionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
