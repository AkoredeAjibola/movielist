import { User } from "../models/user.model.js";

// Profile endpoint to get user information
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id; // Extract user ID from token (ensure it's coming from middleware)

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    // Fetch user data from the database
    const user = await User.findById(userId)
      .select("username email preferences streaks watchHistory watchlist lastWatchedDate")
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compute additional stats if necessary
    const totalMoviesWatched = user.watchHistory?.length || 0;
    const watchlistCount = user.watchlist?.length || 0;

    // Return profile data
    return res.status(200).json({
      success: true,
      profile: {
        username: user.username || "",
        email: user.email || "",
        preferences: user.preferences || [],
        streaks: user.streaks || 0,
        totalMoviesWatched,
        watchlistCount,
        lastWatchedDate: user.lastWatchedDate || null,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
