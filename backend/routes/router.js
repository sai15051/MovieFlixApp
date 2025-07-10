import { Router } from "express";
import { signup,login } from "../controllers/authcontroller.js";
import {
  searchMovies,
  getMovieById,
  getAllMovies,
  getMovieStats
} from '../controllers/moviecontroller.js';
import movieRouter from './movieRoutes.js';
const movieController = require('../controllers/moviecontroller');


const router = Router();



router.post("/signup", signup);
router.post("/login", login);
// router.get('/movies', searchMovies);        
// router.get('/movies/:id', getMovieById);   
// router.get('/movies/all', getAllMovies);   
// router.get('/movies/stats', getMovieStats);
router.get('/trending', movieController.getTrendingMovies);
router.use('/movies', movieRouter);





export default router;