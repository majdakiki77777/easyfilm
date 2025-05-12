// src/app/store.js

import { configureStore } from "@reduxjs/toolkit";
import { tmdbApi } from "../services/TMDB";
import currentGenreOrCategory from "../features/currentGenreOrCategory";
import userReducer from '../features/auth';

export default configureStore({
  reducer: {
    [tmdbApi.reducerPath]: tmdbApi.reducer,
    currentGenreOrCategory,  // using shorthand property
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tmdbApi.middleware),
});
