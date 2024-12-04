import express from "express";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  markAsWatched,
} from "../controllers/watchlist.controller.js";

const router = express.Router();

router.post("/add", addToWatchlist);
router.delete("/watchlist", removeFromWatchlist);
router.get("/", getWatchlist);
router.put("/watchlist/watched", markAsWatched);

export default router;
