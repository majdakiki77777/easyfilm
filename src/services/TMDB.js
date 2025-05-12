import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const tmdbApiKey = process.env.REACT_APP_TMDB_KEY;

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.themoviedb.org/3' }),
  endpoints: (builder) => {
    const tmdbCategories = ['popular', 'top_rated', 'upcoming', 'now_playing', 'latest'];

    return {
      getGenres: builder.query({
        query: () => `genre/movie/list?api_key=${tmdbApiKey}`,
      }),
      getMovies: builder.query({
        query: ({ genreIdOrCategoryName, page, searchQuery, selectedGenres }) => {
          let url = '';

          if (searchQuery) {
            url = `/search/movie?query=${searchQuery}&page=${page}&api_key=${tmdbApiKey}`;
          } else if (Array.isArray(selectedGenres) && selectedGenres.length > 0) {
            const genreString = selectedGenres.join(',');
            url = `discover/movie?with_genres=${genreString}&page=${page}&api_key=${tmdbApiKey}`;
          } else if (
            typeof genreIdOrCategoryName === 'string' &&
            tmdbCategories.includes(genreIdOrCategoryName)
          ) {
            url = `/movie/${genreIdOrCategoryName}?page=${page}&api_key=${tmdbApiKey}`;
          } else if (
            typeof genreIdOrCategoryName === 'string' &&
            !isNaN(Number(genreIdOrCategoryName))
          ) {
            url = `discover/movie?with_genres=${genreIdOrCategoryName}&page=${page}&api_key=${tmdbApiKey}`;
          } else if (typeof genreIdOrCategoryName === 'number') {
            url = `discover/movie?with_genres=${genreIdOrCategoryName}&page=${page}&api_key=${tmdbApiKey}`;
          } else {
            url = `/movie/popular?page=${page}&api_key=${tmdbApiKey}`;
          }

          console.log("✅ TMDB URL:", url);
          return url;
        },
      }),
      getMovie: builder.query({
        query: (id) => `/movie/${id}?append_to_response=videos,credits&api_key=${tmdbApiKey}`,
      }),
      getRecommendations: builder.query({
        query: ({ movie_id, list }) => `/movie/${movie_id}/${list}?api_key=${tmdbApiKey}`,
      }),
      getActorsDetails: builder.query({
        query: (id) => `/person/${id}?api_key=${tmdbApiKey}`,
      }),
      getMoviesByActorId: builder.query({
        query: ({ id }) => `/person/${id}/movie_credits?api_key=${tmdbApiKey}`,
      }),
      getList: builder.query({
        query: ({ listName, accountId, sessionId, page }) =>
          `/account/${accountId}/${listName}?api_key=${tmdbApiKey}&session_id=${sessionId}&page=${page}`,
      }),
    };
  },
});

export const {
  useGetGenresQuery,
  useGetMoviesQuery,
  useGetMovieQuery,
  useGetRecommendationsQuery,
  useGetActorsDetailsQuery,
  useGetMoviesByActorIdQuery,
  useGetListQuery,
} = tmdbApi;













 
 
