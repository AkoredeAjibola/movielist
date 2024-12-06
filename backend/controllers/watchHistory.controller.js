import { User } from '../models/user.model.js';


export const markAsWatched = async (req, res) => {
  try {
    // Extract movieId, watched status, and title from the request body
    const {movieId, watched, title } = req.body;

    // Log the request body for debugging
    console.log("Request Body:", req.body);

    // Validate required fields
    if (!movieId || !title || watched === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get the user ID from the authenticated user
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the movie already exists in the user's watch history
    const existingMovie = user.watchHistory.find((item) => item.movieId === movieId);

    if (existingMovie) {
      // Update existing movie's watched status and timestamp
      existingMovie.watched = watched;
      existingMovie.watchedAt = new Date();
    } else {
      // Add a new entry to the watch history
      user.watchHistory.push({ movieId, title, watched, watchedAt: new Date() });
    }

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      message: existingMovie ? "Watch status updated" : "Movie added to watch history",
      watchHistory: user.watchHistory,
    });
  } catch (error) {
    console.error("Error in markAsWatched:", error);
    return res.status(500).json({ error: error.message || "Failed to update watch status" });
  }
};



export async function getWatchHistory(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    const user = await User.findById(userId).select("watchHistory").sort({ "watchHistory.watchedAt": -1 });

    if (!user || !user.watchHistory) {
      return res.status(404).json({ success: false, message: "No watch history found" });
    }

    res.status(200).json({ success: true, history: user.watchHistory });
  } catch (error) {
    console.error("Error fetching watch history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function deleteWatchHistory(req, res) {
  const { movieId } = req.params; // Expecting movieId as a URL parameter

  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Filter the movie out of the watchHistory
    const initialLength = user.watchHistory.length;
    user.watchHistory = user.watchHistory.filter((item) => item.movieId !== movieId);

    // Check if a movie was removed
    if (user.watchHistory.length === initialLength) {
      return res.status(404).json({ success: false, message: "Movie not found in watch history." });
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({
      success: true,
      message: "Watch history item deleted successfully.",
      watchHistory: user.watchHistory, // Optionally return updated watchHistory
    });
  } catch (error) {
    console.error("Error deleting watch history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
