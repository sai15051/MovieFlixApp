
import express from 'express';
import * as movieController from '../controllers/moviecontroller.js';
import { validateSearchQuery, validateMovieId } from '../middlewares/validation.js';

const router = express.Router();

router.get('/', validateSearchQuery, movieController.searchMovies);
router.get('/:id', validateMovieId, movieController.getMovieById);
router.get('/stats/summary', movieController.getMovieStats);

export default router;