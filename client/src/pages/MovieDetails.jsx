import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.scss';

const TMDB_API_KEY = '7c4829680c5dc82e506e4cf962a26187';
const BASE_URL = 'https://api.themoviedb.org/3';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/movie/${id}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'en-US',
        },
      })
      .then((res) => setMovie(res.data))
      .catch(console.error);
  }, [id]);

  if (!movie) return <div className="loading">Loading details...</div>;

  return (
    <div className="movieDetails">
      <Link to="/my-list" className="backLink">← Back to Movies</Link>

      <div className="detailsContainer">
        <div className="posterSection">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/no-image.png'
            }
            alt={movie.title}
          />
        </div>

        <div className="infoSection">
          <h2>{movie.title} <span className="year">({movie.release_date?.split('-')[0]})</span></h2>
          {movie.tagline && <p className="tagline">"{movie.tagline}"</p>}

          <p><strong>Rating:</strong> {movie.vote_average} ⭐ ({movie.vote_count} votes)</p>
          <p><strong>Runtime:</strong> {movie.runtime} min</p>
          <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
            {movie.homepage && (
    <p><strong>Official Site:</strong> <a href={movie.homepage} target="_blank" rel="noopener noreferrer">{movie.homepage}</a></p>
  )}
          <p className="overview"><strong>Overview:</strong> {movie.overview}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
