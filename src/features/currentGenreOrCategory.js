import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  genreIdOrCategoryName: '',
  searchQuery: '',
  selectedGenres: [],
  page: 1, // ✅ Add default page
};

const genreOrCategory = createSlice({
  name: 'genreOrCategory',
  initialState,
  reducers: {
    selectGenreOrCategory: (state, action) => {
      state.genreIdOrCategoryName = action.payload;
      state.searchQuery = '';
      state.page = 1; // ✅ Reset page
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1; // ✅ Reset page
    },
    toggleGenre: (state, action) => {
      if (state.selectedGenres.includes(action.payload)) {
        state.selectedGenres = state.selectedGenres.filter((id) => id !== action.payload);
      } else {
        state.selectedGenres.push(action.payload);
      }
      state.page = 1; // ✅ Reset page
    },
    clearSelectedGenres: (state) => {
      state.selectedGenres = [];
      state.page = 1; // ✅ Reset page
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const {
  selectGenreOrCategory,
  setSearchQuery,
  toggleGenre,
  clearSelectedGenres,
  setPage,
} = genreOrCategory.actions;

export default genreOrCategory.reducer;



