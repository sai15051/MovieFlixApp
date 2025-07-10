
import axios from 'axios';
import Movie from '../models/Movie.js';
import dotenv from 'dotenv';

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';


const isCacheValid = (lastUpdated) => {
  return (Date.now() - new Date(lastUpdated).getTime()) < 24 * 60 * 60 * 1000;
};


const fetchMovieDetails = async (movieId) => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
    params: { api_key: TMDB_API_KEY }
  });
  return response.data;
};


const fetchCredits = async (movieId) => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
    params: { api_key: TMDB_API_KEY }
  });
  return response.data;
};

export const transformAndCacheMovie = async (tmdbData) => {
  const credits = await fetchCredits(tmdbData.id);
  
  const movieData = {
    imdbID: tmdbData.imdb_id,
    title: tmdbData.title,
    year: tmdbData.release_date?.split('-')[0] || 'N/A',
    genre: tmdbData.genres?.map(g => g.name) || [],
    director: credits.crew
      ?.filter(person => person.job === 'Director')
      .map(person => person.name)
      .join(', ') || 'Unknown',
    actors: credits.cast
      ?.slice(0, 5)
      .map(person => person.name) || [],
    rating: tmdbData.vote_average || 0,
    runtime: tmdbData.runtime || 0,
    plot: tmdbData.overview || '',
    poster: tmdbData.poster_path 
      ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
      : null,
    lastUpdated: new Date()
  };

  return Movie.findOneAndUpdate(
    { imdbID: movieData.imdbID },
    movieData,
    { upsert: true, new: true }
  );
};


export const searchMovies = async (searchQuery, page = 1) => {

  const cachedResults = await Movie.find({
    title: { $regex: searchQuery, $options: 'i' }
  }).sort({ lastUpdated: -1 });

  if (cachedResults.length > 0) {
    return {
      source: 'cache',
      data: cachedResults,
      stats: await getAggregatedStats()
    };
  }


  const response = await axios.get(`${BASE_URL}/search/movie`, {
    params: {
      api_key: TMDB_API_KEY,
      query: searchQuery,
      page
    }
  });


  const movies = await Promise.all(
    response.data.results.map(async (movie) => {
      const details = await fetchMovieDetails(movie.id);
      return await transformAndCacheMovie(details);
    })
  );

  return {
    source: 'api',
    data: movies,
    stats: await getAggregatedStats()
  };
};


export const getMovieById = async (movieId) => {

  const cachedMovie = await Movie.findOne({ imdbID: movieId });
  
  if (cachedMovie && isCacheValid(cachedMovie.lastUpdated)) {
    return { source: 'cache', data: cachedMovie };
  }


  const details = await fetchMovieDetails(movieId);
  const movie = await transformAndCacheMovie(details);

  return { source: 'api', data: movie };
};


export const getAggregatedStats = async () => {
  const stats = await Promise.all([
 
    Movie.aggregate([
      { $unwind: "$genre" },
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    
 
    Movie.aggregate([
      { $unwind: "$genre" },
      { 
        $group: { 
          _id: "$genre", 
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 }
        } 
      },
      { $sort: { avgRating: -1 } }
    ]),
    

    Movie.aggregate([
      { 
        $group: { 
          _id: "$year", 
          avgRuntime: { $avg: "$runtime" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    

    Movie.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ])
  ]);

  return {
    genreCounts: stats[0],
    genreRatings: stats[1],
    runtimeByYear: stats[2],
    averageRating: stats[3][0]?.avgRating?.toFixed(1) || 0,
    totalMovies: stats[0].reduce((sum, genre) => sum + genre.count, 0)
  };
};