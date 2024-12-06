export const markAsWatched = async (req, res) => {
  try {
    const { movieId, movieTitle, watched } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (!movieId || !movieTitle || watched === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check streak logic
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day
    const lastWatchedDate = user.lastWatchedDate ? new Date(user.lastWatchedDate) : null;

    if (lastWatchedDate) {
      lastWatchedDate.setHours(0, 0, 0, 0); // Normalize last watched date

      const diffDays = Math.floor((today - lastWatchedDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Increment streak if it’s the next day
        user.streaks += 1;
      } else if (diffDays > 1) {
        // Reset streak if more than a day has passed
        user.streaks = 0;
      }
    } else {
      // First time marking a movie
      user.streaks = 1;
    }

    // Update last watched date
    user.lastWatchedDate = today;

    // Check if the movie exists in watch history
    const existingMovie = user.watchHistory.find((item) => item.movieId === movieId);

    if (existingMovie) {
      existingMovie.watched = watched;
      existingMovie.watchedAt = new Date();
    } else {
      user.watchHistory.push({ movieId, movieTitle, watched, watchedAt: new Date() });
    }

    // Save the user's data
    await user.save();

    return res.status(200).json({
      message: existingMovie ? "Watch status updated" : "Movie added to watch history",
      watchHistory: user.watchHistory,
      streaks: user.streaks,
      lastWatchedDate: user.lastWatchedDate // Sending the updated last watched date along with streaks
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

    res.status(200).json({ success: true, history: user.watchHistory,  streaks: user.streaks });
  } catch (error) {
    console.error("Error fetching watch history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
export async function deleteWatchHistory(req, res) {
  const { movieId } = req.params;

  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Filter out the movie by `movieId`
    const initialLength = user.watchHistory.length;
    user.watchHistory = user.watchHistory.filter((item) => item.movieId !== movieId);

    if (user.watchHistory.length === initialLength) {
      return res.status(404).json({ success: false, message: "Movie not found in watch history." });
    }

    // Save updated user document
    await user.save();

    res.status(200).json({
      success: true,
      message: "Watch history item deleted successfully.",
      watchHistory: user.watchHistory,
    });
  } catch (error) {
    console.error("Error deleting watch history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
