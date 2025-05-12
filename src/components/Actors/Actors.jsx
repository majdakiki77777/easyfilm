import React from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import useStyles from './actorstyles';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetActorsDetailsQuery, useGetMoviesByActorIdQuery } from '../../services/TMDB';
import MovieList from '../MovieList/MovieList';

const Actors = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const classes = useStyles();

  const { data, isFetching, error } = useGetActorsDetailsQuery(id);
  const { data: credits, isFetching: isFetchingMovies } = useGetMoviesByActorIdQuery({ id });

  // ✅ Clone the array to avoid sorting frozen objects
  const movies = credits?.cast ? [...credits.cast].sort((a, b) => new Date(b.release_date) - new Date(a.release_date)) : [];

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} color="primary">
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={5} xl={4}>
          <img
            className={classes.image}
            src={`https://image.tmdb.org/t/p/w780/${data?.profile_path}`}
            alt={data?.name}
          />
        </Grid>

        <Grid
          item
          lg={7}
          xl={8}
          style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
        >
          <Typography variant="h3" gutterBottom>
            {data?.name}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Born: {new Date(data?.birthday).toDateString()}
          </Typography>
          <Typography variant="body1" align="justify" paragraph>
            {data?.biography || 'Sorry, No Biography yet...'}
          </Typography>

          <Box marginTop="2rem" display="flex" justifyContent="space-around">
            <Button
              variant="contained"
              color="primary"
              target="_blank"
              href={`https://www.imdb.com/name/${data?.imdb_id}`}
            >
              IMDB
            </Button>
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} color="primary">
              Go Back
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box margin="2rem 0">
        <Typography variant="h4" gutterBottom align="center">
          {data?.name} Movies
        </Typography>
        {isFetchingMovies ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress size="4rem" />
          </Box>
        ) : (
          movies && <MovieList movies={movies} numberOfMovies={12} />
        )}
      </Box>
    </>
  );
};

export default Actors;






