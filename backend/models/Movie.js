
import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  imdbID: { type: String, unique: true },
  title: String,
  year: String,
  genre: [String],
  director: String,
  actors: [String],
  rating: Number,
  runtime: String,
  plot: String,
  poster: String,
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model('Movie', movieSchema);