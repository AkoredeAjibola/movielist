import express from 'express';
import { addWatchHistory, getWatchHistory, deleteWatchHistory, markAsWatched } from '../controllers/watchHistory.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/add', protectRoute, addWatchHistory);
router.get('/', protectRoute, getWatchHistory);
router.delete('/:id', protectRoute, deleteWatchHistory);
router.post("/watched", protectRoute, markAsWatched);

export default router;
