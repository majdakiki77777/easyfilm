import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../../features/currentGenreOrCategory';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import useStyles from './searchstyles';

const Search = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const tmdbApiKey = process.env.REACT_APP_TMDB_KEY;

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      if (!query.trim()) return;
      const result = await fetchResults(query);
      setSuggestions(result);
    }
  };

  const fetchResults = async (searchText) => {
    try {
      const movieResponse = await axios.get(
        `https://api.themoviedb.org/3/search/movie?query=${searchText}&api_key=${tmdbApiKey}`
      );
      const personResponse = await axios.get(
        `https://api.themoviedb.org/3/search/person?query=${searchText}&api_key=${tmdbApiKey}`
      );

      const results = [];

      personResponse.data.results.forEach((person) =>
        results.push({ ...person, type: 'actor' })
      );
      movieResponse.data.results.forEach((movie) =>
        results.push({ ...movie, type: 'movie' })
      );

      return results;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const handleSelect = (item) => {
    setQuery('');
    setSuggestions([]);
    if (item.type === 'movie') {
      dispatch(setSearchQuery(item.title));
    } else if (item.type === 'actor') {
      navigate(`/actors/${item.id}`);
    }
  };

  if (location.pathname !== '/') return null;

  return (
    <div className={classes.searchContainer}>
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        variant="standard"
        placeholder="Search movies or actors"
        InputProps={{
          className: classes.input,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        fullWidth
      />
      {suggestions.length > 0 && (
        <Paper className={classes.suggestionsContainer}>
          <List>
            {suggestions.map((item) => (
              <ListItem
                button
                key={`${item.id}-${item.type}`}
                onClick={() => handleSelect(item)}
              >
                <ListItemText
                  primary={item.title || item.name}
                  secondary={item.type === 'movie' ? 'Movie' : 'Actor'}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default Search;

