import axios from 'axios';

export const fetchMovieDetails = async (movieId) => {
  try {
    const API_KEY = process.env.REACT_APP_TMDB_KEY;
    const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
    return data;
  } catch (err) {
    console.error("Error fetching TMDB movie details for ID:", movieId, err.message);
    return null;
  }
};

