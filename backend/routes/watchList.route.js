// routes/watchlist.routes.js
import { Router } from 'express';
import { addToWatchlist, getWatchlist, updateWatchlist, removeFromWatchlist } from '../controllers/watchlist.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = Router();

router.post('/add', protectRoute, addToWatchlist);  // Add movie to watchlist
router.get('/', protectRoute,  getWatchlist);  // Get all movies in the watchlist
router.put('/update/:movieId', protectRoute, updateWatchlist);  // Update (mark as watched/unwatched)
router.delete('/remove/:movieId',protectRoute, removeFromWatchlist);  // Remove movie from watchlist

export default router;
