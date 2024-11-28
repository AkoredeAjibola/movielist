
import {User} from "../models/user.model.js";

export async function addToWatchlist(req, res) {
    const { movieId, title, poster_path } = req.body; // Movie data
    const userId = req.user._id; // Assuming user is authenticated
  
    // Validate input data
    if (!movieId || !title || !poster_path) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: movieId, title, or poster_path",
      });
    }
  
    try {
      const user = await User.findById(userId);
      const alreadyInWatchlist = user.watchlist.some((movie) => movie.id === movieId);
  
      if (alreadyInWatchlist) {
        return res.status(400).json({ success: false, message: "Movie already in watchlist" });
      }
  
      user.watchlist.push({ id: movieId, title, poster_path });
      await user.save();
  
      res.status(200).json({ success: true, message: "Movie added to watchlist" });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
  




export async function getWatchlist(req, res) {
    const userId = req.user._id; // Assuming user is authenticated
  
    try {
      const user = await User.findById(userId).select('watchlist');
      res.status(200).json({ success: true, content: user.watchlist });
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
  

export async function updateWatchlist(req, res) {
    const { movieId } = req.params;
    const userId = req.user._id; // Assuming user is authenticated
  
    try {
      const user = await User.findById(userId);
      const movie = user.watchlist.find(movie => movie.id === movieId);
  
      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found in watchlist' });
      }
  
      movie.watched = !movie.watched; // Toggle watched status
      await user.save();
  
      res.status(200).json({ success: true, message: `Movie marked as ${movie.watched ? 'watched' : 'unwatched'}` });
    } catch (error) {
      console.error('Error updating watchlist:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
  


export async function removeFromWatchlist(req, res) {
    const { movieId } = req.params;
    const userId = req.user._id; // Assuming user is authenticated
  
    try {
      const user = await User.findById(userId);
      user.watchlist = user.watchlist.filter(movie => movie.id !== movieId);
  
      await user.save();
  
      res.status(200).json({ success: true, message: 'Movie removed from watchlist' });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
  