import { baseHTTP } from '../utils/http.js';
const axios = require('axios');

import * as movieService from '../services/movieService.js';
dotenv.config()

export const searchMovies = async (req, res) => {
  try {
    const { search, page = 1 } = req.query;
    const result = await movieService.searchMovies(search, page);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const result = await movieService.getMovieById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMovieStats = async (req, res) => {
  try {
    const stats = await movieService.getAggregatedStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

exports.getTrendingMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    
    const response = await axios.get(`${BASE_URL}/trending/all/week`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        page
      }
    });

    const normalized = response.data.results.map(movie => ({
      id: movie.id,
      title: movie.title || movie.name || 'Untitled',
      poster_path: movie.poster_path,
      overview: movie.overview,
      year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
      rating: movie.vote_average,
      genre: movie.genre_ids || [],
      runtime: movie.runtime || 0
    }));

    res.json({
      data: normalized,
      totalPages: response.data.total_pages,
      page: parseInt(page)
    });
    
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};
export const getAllMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;

 
    const response = await baseHTTP.get('/trending/all/week', {
      params: { page },
    });

    const rawMovies = response.data.results;


    const movies = rawMovies.map((movie) => ({
      id: movie.id,
      title: movie.title || movie.name || 'Untitled',
      poster_path: movie.poster_path,
      overview: movie.overview,
      year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
      rating: movie.vote_average,
      genre_ids: movie.genre_ids,
    }));


    res.json({
      movies,
      page: parseInt(page, 10),
      totalPages: response.data.total_pages,
    });
  } catch (err) {
    console.error('getAllMovies error:', err.message);
    res.status(500).json({ error: 'Failed to fetch movies from TMDB' });
  }
};





