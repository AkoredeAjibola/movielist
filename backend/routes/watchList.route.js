import express from "express";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  markAsWatched,
} from "../controllers/watchlist.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/add", protectRoute, addToWatchlist);
router.delete("/remove/:id", protectRoute, removeFromWatchlist);
router.get("/", protectRoute, getWatchlist);
router.put("/watched", protectRoute, markAsWatched);

export default router;
