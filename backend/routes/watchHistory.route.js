import express from 'express';
import { getWatchHistory, deleteWatchHistory, markAsWatched } from '../controllers/watchHistory.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();


router.get('/', protectRoute, getWatchHistory);
router.delete('/:id', protectRoute, deleteWatchHistory);
router.put("/watched", protectRoute, markAsWatched);

export default router;
