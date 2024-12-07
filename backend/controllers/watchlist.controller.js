import { User } from "../models/user.model.js";

// Add movie to watchlist
// Add movie to watchlist controller
export const addToWatchlist = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from the URL params
    const { movieId, title, poster_path } = req.body; // Get movie details from the request body

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the movie already exists in the watchlist
    const movieExists = user.watchlist.some(movie => movie.id === movieId);

    if (movieExists) {
      return res.status(400).json({ message: "Movie is already in your watchlist" });
    }

    // Add movie to watchlist
    user.watchlist.push({
      id: movieId,
      title,
      poster_path,
      watched: false, // default value for new movies
    });

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Movie added to watchlist", watchlist: user.watchlist });
  } catch (error) {
    console.error("Error adding movie to watchlist:", error);
    res.status(500).json({ error: "Failed to add movie to watchlist" });
  }
};


// Remove movie from watchlist
export const removeFromWatchlist = async (req, res) => {
  try {
    const { userId } = req.body; // Get the userId from the body
    const { id } = req.params; // Get the movieId from the URL parameter

    if (!userId || !id) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Remove movie from the watchlist
    user.watchlist = user.watchlist.filter((movie) => movie.id !== id);

    await user.save();
    res.status(200).json({ message: "Movie removed from watchlist.", watchlist: user.watchlist });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    res.status(500).json({ error: "Failed to remove movie from watchlist." });
  }
};

// Get user's watchlist
// Get Watchlist controller
export const getWatchlist = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from the URL params

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's watchlist
    res.status(200).json({ watchlist: user.watchlist });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
};


