import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';
import selectionReducer from '../reducers/selectionSlice';

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  selection: selectionReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
