import axios from 'axios';

export const getRecommendations = async (favoriteIds, watchlistIds) => {
  try {
    const { data } = await axios.post('http://127.0.0.1:5000/recommend', {
      favorite_ids: favoriteIds,
      watchlist_ids: watchlistIds,
    });
    return data.recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};



