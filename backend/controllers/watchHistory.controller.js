import { WatchHistory } from '../models/watchHistory.js';



export const markAsWatched = async (req, res) => {
  try {
    const { movieId, watched } = req.body;
    const userId = req.user?.id;

    if (!movieId || typeof watched !== "boolean") {
      return res.status(400).json({ message: "Invalid movie ID or watched status" });
    }

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Debug: Log the incoming data
    console.log("Incoming Request Data:", { movieId, watched, userId });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const movie = user.watchHistory.find((item) => item.movieId === movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found in watch history" });
    }

    movie.watched = watched;
    await user.save();

    res.status(200).json({ message: "Movie status updated", watchHistory: user.watchHistory });
  } catch (error) {
    console.error("Error in markAsWatched controller:", error.message, error.stack);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export async function addWatchHistory(req, res) {
  const { movieId, movieTitle } = req.body;

  if (!movieId || !movieTitle) {
    return res.status(400).json({ success: false, message: 'Movie ID and title are required.' });
  }

  try {
    const newHistory = new WatchHistory({
      user: req.user.id, // Ensure you're using authentication middleware
      movieId,
      movieTitle,
    });

    await newHistory.save();
    res.status(201).json({ success: true, message: 'Watch history added successfully', history: newHistory });
  } catch (error) {
    console.error('Error adding to watch history:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

export async function getWatchHistory(req, res) {
  try {
    const history = await WatchHistory.find({ user: req.user.id }).sort({ watchedAt: -1 });
    res.status(200).json({ success: true, history });
  } catch (error) {
    console.error('Error fetching watch history:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

export async function deleteWatchHistory(req, res) {
  const { id } = req.params;

  try {
    const history = await WatchHistory.findOneAndDelete({ _id: id, user: req.user.id });
    if (!history) {
      return res.status(404).json({ success: false, message: 'History item not found.' });
    }
    res.status(200).json({ success: true, message: 'Watch history item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting watch history:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
