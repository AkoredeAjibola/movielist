import { User } from '../models/user.model.js';



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

    // Check if the movie already exists in the user's watch history
    const existingMovie = user.watchHistory.find((item) => item.movieId === movieId);

    if (existingMovie) {
      // Movie exists, update the watched status
      existingMovie.watched = watched;
      await user.save();
      return res.status(200).json({ message: "Watch status updated", watchHistory: user.watchHistory });
    } else {
      // Movie does not exist in the history, add it
      user.watchHistory.push({ movieId, watched });
      await user.save();
      return res.status(201).json({ message: "Movie added to watch history", watchHistory: user.watchHistory });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to update watch status" });
  }
};



export async function addWatchHistory(req, res) {
  const { movieId, movieTitle } = req.body;

  if (!movieId || !movieTitle) {
    return res.status(400).json({ success: false, message: 'Movie ID and title are required.' });
  }

  try {
    const newHistory = new User({
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
    const history = await User.find({ user: req.user.id }).sort({ watchedAt: -1 });
    res.status(200).json({ success: true, history });
  } catch (error) {
    console.error('Error fetching watch history:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
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
