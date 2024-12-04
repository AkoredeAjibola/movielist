import { User } from "../models/user.model.js";

// Add movie to watchlist
export const addToWatchlist = async (req, res) => {
  try {
    const { userId, movie } = req.body; // movie = { id, title, poster_path }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingMovie = user.watchlist.find((item) => item.id === movie.id);

    if (existingMovie) {
      return res.status(400).json({ message: "Movie already in watchlist" });
    }

    user.watchlist.push(movie);
    await user.save();

    res.status(201).json({ message: "Movie added to watchlist", watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ error: "Failed to add movie to watchlist" });
  }
};

// Remove movie from watchlist
export const removeFromWatchlist = async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.watchlist = user.watchlist.filter((movie) => movie.id !== movieId);
    await user.save();

    res.status(200).json({ message: "Movie removed from watchlist", watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove movie from watchlist" });
  }
};


// Get user's watchlist
export const getWatchlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
};


// Mark movie as watched
export const markAsWatched = async (req, res) => {
  try {
    const { userId, movieId, watched } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const movie = user.watchlist.find((item) => item.id === movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found in watchlist" });
    }

    movie.watched = watched;
    await user.save();

    res.status(200).json({ message: "Movie status updated", watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ error: "Failed to update movie status" });
  }
};
