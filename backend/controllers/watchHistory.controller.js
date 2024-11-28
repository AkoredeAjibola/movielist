import { WatchHistory } from '../models/watchHistory.js';

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
