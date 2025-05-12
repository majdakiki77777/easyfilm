import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetMoviesQuery } from '../../services/TMDB';
import MovieList from '../MovieList/MovieList';
import Pagination from '../Pagination/Pagination';
import { setPage } from '../../features/currentGenreOrCategory';

const Movies = () => {
  const dispatch = useDispatch();
  const {
    genreIdOrCategoryName,
    searchQuery,
    selectedGenres,
    page
  } = useSelector((state) => state.currentGenreOrCategory);

  // ✅ Guard against undefined/NaN/0 pages
  const pageToUse = Number.isInteger(page) && page > 0 ? page : 1;

  const { data, error, isFetching } = useGetMoviesQuery({
    genreIdOrCategoryName,
    page: pageToUse,
    searchQuery,
    selectedGenres,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [genreIdOrCategoryName, searchQuery, selectedGenres, pageToUse]);

  console.log("🧠 Querying page:", pageToUse);

  if (isFetching) return <div>Loading...</div>;

  if (error) {
    console.error("❌ TMDB API Error:", error);
    return (
      <div>
        <h2>Something went wrong.</h2>
        <pre style={{ whiteSpace: 'pre-wrap', color: 'red' }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <>
      <MovieList movies={data?.results} />
      <Pagination
        currentPage={pageToUse}
        setPage={(val) => dispatch(setPage(val))}
        totalPages={data?.total_pages}
      />
    </>
  );
};

export default Movies;






