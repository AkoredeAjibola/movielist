import { User } from '../models/user.model.js';



import { User } from '../models/user.model.js';

export const markAsWatched = async (req, res) => {
  try {
    const { movieId, watched, movieTitle } = req.body;
    const userId = req.user?.id; // Assuming req.user is populated after token validation

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the movie already exists in the user's watch history
    const existingMovieIndex = user.watchHistory.findIndex((item) => item.movieId === movieId);

    if (existingMovieIndex !== -1) {
      // Movie exists, update the watched status
      user.watchHistory[existingMovieIndex].watched = watched;
      user.watchHistory[existingMovieIndex].watchedAt = new Date(); // Mark the time when watched status is updated
      await user.save();
      return res.status(200).json({ message: "Watch status updated", watchHistory: user.watchHistory });
    } else {
      // Movie does not exist in the history, add it without repetition
      user.watchHistory.push({ movieId, movieTitle, watched, watchedAt: new Date() });
      await user.save();
      return res.status(201).json({ message: "Movie added to watch history", watchHistory: user.watchHistory });
    }
  } catch (error) {
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
  const { id } = req.params;

  try {
    const history = await User.findOneAndDelete({ _id: id, user: req.user.id });
    if (!history) {
      return res.status(404).json({ success: false, message: 'History item not found.' });
    }
    res.status(200).json({ success: true, message: 'Watch history item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting watch history:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
