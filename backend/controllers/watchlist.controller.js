import { User } from "../models/user.model.js";

// Add movie to watchlist
export const addToWatchlist =  async (req, res) => {
  const { userId, movieId, title, poster_path } = req.body;

  try {
    if (!userId || !movieId || !title) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the movie already exists in the watchlist
    const movieExists = user.watchlist.some((movie) => movie.id === movieId);
    if (movieExists) {
      return res.status(400).json({ message: "Movie already in watchlist." });
    }

    // Add movie to the watchlist
    user.watchlist.push({ id: movieId, title, poster_path });
    await user.save();

    res.status(200).json({ message: "Movie added to watchlist.", watchlist: user.watchlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add movie to watchlist." });
  }
};


// Remove movie from watchlist
export const removeFromWatchlist = async (req, res) => {
  const { userId } = req.body;
  const { movieId } = req.params;

  try {
    if (!userId || !movieId) {
      return res.status(400).json({ message: "User ID and Movie ID are required." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Filter the movie out of the watchlist
    user.watchlist = user.watchlist.filter((movie) => movie.id !== movieId);
    await user.save();

    res.status(200).json({ message: "Movie removed from watchlist.", watchlist: user.watchlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove movie from watchlist." });
  }
};
