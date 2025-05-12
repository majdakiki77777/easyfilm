import React, { useEffect, useState } from 'react';
import { Typography, Button, Box, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { ExitToApp } from '@mui/icons-material';
import { userSelector } from '../../features/auth';
import { useGetListQuery } from '../../services/TMDB';
import { getRecommendations } from '../../api/recommendations';
import { fetchMovieDetails } from '../../api/movieDetails';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useSelector(userSelector);

  const { data: favoriteMovies, refetch: refetchFavorites } = useGetListQuery({
    listName: 'favorite/movies',
    accountId: user.id,
    sessionId: localStorage.getItem('session_id'),
    page: 1,
  });

  const { data: watchlistMovies, refetch: refetchWatchlisted } = useGetListQuery({
    listName: 'watchlist/movies',
    accountId: user.id,
    sessionId: localStorage.getItem('session_id'),
    page: 1,
  });

  const [recommendations, setRecommendations] = useState([]);
  const [detailedRecommendations, setDetailedRecommendations] = useState([]);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  useEffect(() => {
    refetchFavorites();
    refetchWatchlisted();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!favoriteMovies?.results?.length && !watchlistMovies?.results?.length) {
        setRecommendations([]);
        return;
      }

      const favoriteIds = favoriteMovies?.results?.map((movie) => movie.id) || [];
      const watchlistIds = watchlistMovies?.results?.map((movie) => movie.id) || [];

      const recs = await getRecommendations(favoriteIds, watchlistIds);
      setRecommendations(recs || []);
    };

    fetchRecommendations();
  }, [favoriteMovies, watchlistMovies]);

  useEffect(() => {
    const fetchDetailedRecommendations = async () => {
      const detailed = [];

      for (const group of recommendations) {
        const basedOn = group.based_on;
        const recommendedMovies = group.recommended;

        const seenMovieIds = new Set();

        const detailedGroup = {
          based_on: basedOn,
          movies: [],
        };

        for (const movie of recommendedMovies) {
          if (seenMovieIds.has(movie.id)) continue;
          seenMovieIds.add(movie.id);

          const movieDetails = await fetchMovieDetails(movie.id);
          if (movieDetails) {
            detailedGroup.movies.push({
              id: movieDetails.id,
              title: movieDetails.title,
              poster_path: movieDetails.poster_path,
            });
          }
        }

        detailed.push(detailedGroup);
      }

      setDetailedRecommendations(detailed);
    };

    if (recommendations.length > 0) {
      fetchDetailedRecommendations();
    }
  }, [recommendations]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">My Profile</Typography>
        <Button color="inherit" onClick={logout}>
          Logout &nbsp;
          <ExitToApp />
        </Button>
      </Box>

      {!favoriteMovies?.results?.length && !watchlistMovies?.results?.length ? (
        <Typography variant="h6">Add some favorites or watchlist movies to get recommendations!</Typography>
      ) : (
        <Box>

          {/* 🛠️ Show Favorites */}
          {favoriteMovies?.results?.length > 0 && (
            <Box mb={4}>
              <Typography variant="h5" gutterBottom>My Favorite Movies</Typography>
              <Grid container spacing={2}>
                {favoriteMovies.results.map((movie) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={`fav-${movie.id}`}>
                    <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                            : 'https://via.placeholder.com/300x450?text=No+Image'
                        }
                        alt={movie.title}
                        style={{ width: '100%', borderRadius: '10px' }}
                      />
                      <Typography variant="subtitle1" align="center" mt={1}>
                        {movie.title}
                      </Typography>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* 🛠️ Show Watchlist */}
          {watchlistMovies?.results?.length > 0 && (
            <Box mb={4}>
              <Typography variant="h5" gutterBottom>My Watchlist</Typography>
              <Grid container spacing={2}>
                {watchlistMovies.results.map((movie) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={`watch-${movie.id}`}>
                    <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                            : 'https://via.placeholder.com/300x450?text=No+Image'
                        }
                        alt={movie.title}
                        style={{ width: '100%', borderRadius: '10px' }}
                      />
                      <Typography variant="subtitle1" align="center" mt={1}>
                        {movie.title}
                      </Typography>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* 🛠️ Recommended Section */}
          <Typography variant="h5" gutterBottom>
            Recommended For You
          </Typography>

          {detailedRecommendations.length > 0 ? (
            detailedRecommendations.map((group, idx) => (
              <Box key={`group-${idx}`} mb={4}>
                <Typography variant="h6" gutterBottom>
                  Because you liked <strong>{group.based_on}</strong>:
                </Typography>
                <Grid container spacing={2}>
                  {group.movies.map((movie, movieIdx) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={`recommend-${movie.id}-${idx}-${movieIdx}`}>
                      <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
                        <img
                          src={
                            movie.poster_path
                              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                              : 'https://via.placeholder.com/300x450?text=No+Image'
                          }
                          alt={movie.title}
                          style={{ width: '100%', borderRadius: '10px' }}
                        />
                        <Typography variant="subtitle1" align="center" mt={1}>
                          {movie.title}
                        </Typography>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))
          ) : (
            <Typography>No recommendations found yet.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Profile;













































