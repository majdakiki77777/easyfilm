import React, { useEffect, useState } from 'react';
import {
  Modal, Typography, Button, ButtonGroup, Grid, Box, CircularProgress, Rating
} from '@mui/material';
import {
  Movie as MovieIcon, Theaters, Language, PlusOne, Favorite,
  FavoriteBorderOutlined, Remove, ArrowBack
} from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import {
  useGetListQuery,
  useGetMovieQuery,
  useGetRecommendationsQuery
} from '../../services/TMDB';
import useStyles from './informationstyles';
import genreIcons from '../../assets/genres';
import { useDispatch, useSelector } from 'react-redux';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import MovieList from '../MovieList/MovieList';
import axios from 'axios';
import { userSelector } from '../../features/auth';

const MovieInformation = () => {
  const { user } = useSelector(userSelector);
  const { id } = useParams();
  const { data, isFetching, error } = useGetMovieQuery(id);
  const { data: recommendations } = useGetRecommendationsQuery({
    list: 'recommendations',
    movie_id: id
  });

  const [open, setOpen] = useState(false);
  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);

  const { data: favoriteMovies } = useGetListQuery({
    listName: 'favorite/movies',
    accountId: user.id,
    sessionId: localStorage.getItem('session_id'),
    page: 1
  });

  const { data: watchlistMovies } = useGetListQuery({
    listName: 'watchlist/movies',
    accountId: user.id,
    sessionId: localStorage.getItem('session_id'),
    page: 1
  });

  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsMovieFavorited(!!favoriteMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [favoriteMovies, data]);

  useEffect(() => {
    setIsMovieWatchlisted(!!watchlistMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [watchlistMovies, data]);

  const addToFavorites = async () => {
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`, {
      media_type: 'movie',
      media_id: id,
      favorite: !isMovieFavorited
    });
    setIsMovieFavorited((prev) => !prev);
  };

  const addToWatchlist = async () => {
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`, {
      media_type: 'movie',
      media_id: id,
      watchlist: !isMovieWatchlisted
    });
    setIsMovieWatchlisted((prev) => !prev);
  };

  if (isFetching) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center'>
        <CircularProgress size='8rem' />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center'>
        <Link to='/'>Something has gone wrong - Go Back</Link>
      </Box>
    );
  }

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid item sm={12} lg={4} style={{ display: 'flex', marginBottom: '30px' }}>
        <img className={classes.poster} src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`} alt={data?.title} />
      </Grid>

      <Grid item container direction='column' lg={7}>
        <Typography variant='h4' align='center' gutterBottom>
          {data?.title} ({data?.release_date?.split('-')[0]})
        </Typography>
        <Typography variant='h5' align='center' gutterBottom>
          {data?.tagline}
        </Typography>

        <Grid item className={classes.containerSpaceAround}>
          <Box display='flex' align="center">
            <Rating readOnly value={data.vote_average / 2} />
            <Typography variant='subtitle1' gutterBottom style={{ marginLeft: '10px' }}>
              {data?.vote_average} / 10
            </Typography>
          </Box>
          <Typography align='center' gutterBottom style={{ fontSize: '16px' }}>
            {data?.runtime}min | Language: {data?.spoken_languages?.[0]?.name}
          </Typography>
        </Grid>

        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre) => (
            <Link
              key={genre.name}
              className={classes.links}
              to='/'
              onClick={() => dispatch(selectGenreOrCategory(genre.id))}
            >
              <img
                src={genreIcons[genre.name.toLowerCase()]}
                className={classes.genreImage}
                height={30}
              />
              <Typography color='textPrimary' variant='subtitle1'>
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>

        <Typography variant='h5' gutterBottom style={{ marginTop: '10px' }}>
          Overview
        </Typography>
        <Typography style={{ marginBottom: '2rem' }}>
          {data?.overview}
        </Typography>

        <Typography variant='h5' gutterBottom>Top Cast</Typography>
        <Grid item container spacing={2}>
          {data?.credits?.cast?.slice(0, 6).map((character, i) => (
            character.profile_path && (
              <Grid
                item key={i}
                xs={4} md={2}
                component={Link}
                to={`/actors/${character.id}`}
                style={{ textDecoration: 'none' }}
              >
                <img className={classes.castImage} src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`} alt={character.name} />
                <Typography color='textPrimary'>{character.name}</Typography>
                <Typography color='textSecondary'>{character.character.split('/')[0]}</Typography>
              </Grid>
            )
          ))}
        </Grid>

        <Grid item container style={{ marginTop: '2rem' }}>
          <div className={classes.buttonsContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size='small' variant='outlined'>
                <Button target='_blank' rel='noopener noreferrer' href={data?.homepage} endIcon={<Language />}>Website</Button>
                <Button target='_blank' rel='noopener noreferrer' href={`https://www.imdb.com/title/${data?.imdb_id}`} endIcon={<MovieIcon />}>IMDB</Button>
                <Button onClick={() => setOpen(true)} endIcon={<Theaters />}>Trailer</Button>
              </ButtonGroup>
            </Grid>

            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size='medium' variant='outlined'>
                <Button onClick={addToFavorites} endIcon={isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite />}>
                  {isMovieFavorited ? 'Unfavorite' : 'Favorite'}
                </Button>
                <Button onClick={addToWatchlist} endIcon={isMovieWatchlisted ? <Remove /> : <PlusOne />}>
                  Watchlist
                </Button>
                <Button endIcon={<ArrowBack />} sx={{ borderColor: 'primary.main' }}>
                  <Typography style={{ textDecoration: 'none' }} component={Link} to='/' color='inherit' variant='subtitle2'>
                    Back
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>

      <Box marginTop='5rem' width='100%'>
        <Typography variant='h4' gutterBottom align='center'>
          You might also like
        </Typography>
        {recommendations?.results?.length > 0 ? (
          <MovieList movies={recommendations.results} numberOfMovies={12} />
        ) : (
          <Box>Sorry, nothing was found.</Box>
        )}
      </Box>

      {data?.videos?.results?.length > 0 && (
        <Modal
          closeAfterTransition
          className={classes.modal}
          open={open}
          onClose={() => setOpen(false)}
        >
          <iframe
            autoPlay
            className={classes.video}
            frameBorder="0"
            title='Trailer'
            src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
            allow='autoplay'
          />
        </Modal>
      )}
    </Grid>
  );
};

export default MovieInformation;

