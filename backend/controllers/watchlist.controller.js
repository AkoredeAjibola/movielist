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
// export const markAsWatched = async (req, res) => {
//   try {
//     const { userId, movieId, watched } = req.body;

//     // Find user by userId
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if the movie is already in the watch history
//     const movieIndex = user.watchHistory.findIndex((item) => item.id === movieId);

//     if (watched && movieIndex === -1) {
//       // Add movie to the watch history
//       user.watchHistory.push({ id: movieId, watchedDate: new Date() });
//     } else if (!watched && movieIndex !== -1) {
//       // Remove movie from the watch history if it's unmarked
//       user.watchHistory.splice(movieIndex, 1);
//     }

//     await user.save();

//     res.status(200).json({ message: "Watch history updated", watchHistory: user.watchHistory });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update watch history" });
//   }
// };


 export const markAsWatched = async (req, res) => {
  try {
    const { movieId, watched } = req.body;
    const userId = req.user?.id; // Assuming req.user is populated after token validation

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const movie = user.watchHistory.find((item) => item.movieId === movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found in history" });
    }

    movie.watched = watched;
    await user.save();

    return res.status(200).json({ message: "Watch status updated", watchHistory: user.watchHistory });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to update watch status" });
  }
};
