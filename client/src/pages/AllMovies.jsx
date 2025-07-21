






import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AllMovies.scss';
import Navbar from '../components/Navbar/Navbar';
import StatsDashboard from './StatsDashboard';



const TMDB_API_KEY = '7c4829680c5dc82e506e4cf962a26187';
const BASE_URL = 'https://api.themoviedb.org/3';

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    year: '',
    rating: ''
  });
  const [stats, setStats] = useState(null);


const fetchMovies = async (pageNum = 1) => {
  setLoading(true);
  try {
    const res = await axios.get(`https://api.themoviedb.org/3/trending/all/week`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        page: pageNum,
      }
    });


   

      const rawMovies = res.data.results;

      const normalized = rawMovies.map((movie) => ({
        id: movie.id,
        title: movie.title || movie.name || 'Untitled',
        poster_path: movie.poster_path,
        overview: movie.overview,
        year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
        rating: movie.vote_average,
        genre: movie.genre_ids || [], 
        runtime: movie.runtime || 0
      }));

      setMovies(normalized);
      setFilteredMovies(normalized);
      setPage(pageNum);
      setTotalPages(res.data.total_pages);
      calculateStats(normalized);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
      setMovies([]);
      setFilteredMovies([]);
    }
    setLoading(false);
  };


  const calculateStats = (moviesData) => {
    if (!moviesData || moviesData.length === 0) {
      setStats(null);
      return;
    }

    const genreCounts = {};

    const genreRatings = {};

    const runtimeByYear = {};

    moviesData.forEach(movie => {

      movie.genre?.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        genreRatings[genre] = genreRatings[genre] || { sum: 0, count: 0 };
        genreRatings[genre].sum += movie.rating || 0;
        genreRatings[genre].count += 1;
      });

      if (movie.year) {
        runtimeByYear[movie.year] = runtimeByYear[movie.year] || { sum: 0, count: 0 };
        runtimeByYear[movie.year].sum += movie.runtime || 0;
        runtimeByYear[movie.year].count += 1;
      }
    });

    const statsData = {
      genreCounts: Object.entries(genreCounts).map(([genre, count]) => ({
        _id: genre,
        count
      })),
      genreRatings: Object.entries(genreRatings).map(([genre, data]) => ({
        _id: genre,
        avgRating: data.sum / data.count
      })),
      runtimeByYear: Object.entries(runtimeByYear).map(([year, data]) => ({
        _id: year,
        avgRuntime: data.sum / data.count
      })),
      averageRating: moviesData.reduce((sum, movie) => sum + (movie.rating || 0), 0) / moviesData.length,
      totalMovies: moviesData.length
    };

    setStats(statsData);
  };

  useEffect(() => {
    let result = [...movies];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(term) ||
          (m.year && m.year.toString().includes(term)))
    }
 
    if (filters.year) {
      result = result.filter(m => m.year === filters.year);
    }
    
    if (filters.rating) {
      result = result.filter(m => Math.floor(m.rating) >= parseInt(filters.rating));
    }
    
    setFilteredMovies(result);
  }, [searchTerm, movies, filters]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedMovies = React.useMemo(() => {
    if (!sortConfig.key) return filteredMovies;
    
    return [...filteredMovies].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredMovies, sortConfig]);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      year: '',
      rating: ''
    });
    setSearchTerm('');
  };


  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  return (
    <>
    <Navbar></Navbar>
    <div className="allMoviesContainer">
      
      <h2>Trending Movies</h2>

      <div className="controls">
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search movies by title or year..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select 
            name="year" 
            value={filters.year} 
            onChange={handleFilterChange}
          >
            <option value="">Filter by Year</option>
            {[...new Set(movies.map(movie => movie.year))].sort().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select 
            name="rating" 
            value={filters.rating} 
            onChange={handleFilterChange}
          >
            <option value="">Filter by Min Rating</option>
            <option value="7">7+</option>
            <option value="8">8+</option>
            <option value="9">9+</option>
          </select>

          <button onClick={resetFilters}>Reset Filters</button>
        </div>
      </div>

      {!searchTerm && !filters.year && !filters.rating && stats && (
        <StatsDashboard stats={stats} />
      )}

      {loading && <p>Loading movies...</p>}

      <div className="moviesTableContainer">
        {filteredMovies.length === 0 && !loading && <p>No movies found.</p>}

        <table className="moviesTable">
          <thead>
            <tr>
              <th>Poster</th>
              <th onClick={() => requestSort('title')}>
                Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('year')}>
                Year {sortConfig.key === 'year' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('rating')}>
                Rating {sortConfig.key === 'rating' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedMovies.map((movie) => (
              <tr key={movie.id}>
                <td>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                        : '/no-image.png'
                    }
                    alt={movie.title}
                    className="tablePoster"
                  />
                </td>
                <td>{movie.title}</td>
                <td>{movie.year}</td>
                <td>{movie.rating ? movie.rating.toFixed(1) : 'N/A'}</td>
                <td>
                  <Link to={`/movies/${movie.id}`} className="viewLink">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!searchTerm && !filters.year && !filters.rating && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
    </>

  );
};

export default AllMovies;