import React from 'react';
import { Grid, Typography } from '@mui/material';
import Movie from '../Movie/Movie';
import useStyles from './movieliststyles';

const MovieList = ({ movies }) => {
  const classes = useStyles();

  if (!movies || movies.length === 0) {
    return <Typography variant="h6" align="center">No movies found for this actor.</Typography>;
  }

  return (
    <Grid container className={classes.moviesContainer}>
      {movies.map((movie, i) => (
        <Movie key={movie.id || i} movie={movie} i={i} />
      ))}
    </Grid>
  );
};

export default MovieList;


