import { User } from "../models/user.model.js";


// Get Profile Controller
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;  // Extract user ID from the request (middleware)

    // If no userId, the user is not authenticated, send unauthorized error
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    // Fetch user data from the database
    const user = await User.findById(userId)
      .select("username email preferences streaks watchHistory watchlist lastWatchedDate")  // Selecting relevant fields
      .lean();  // Return a plain JavaScript object

    // If no user found, return Not Found error
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compute additional stats (handling empty arrays)
    const totalMoviesWatched = user.watchHistory?.length || 0;
    const watchlistCount = user.watchlist?.length || 0;

    // Prepare the profile data to return
    const profile = {
      username: user.username || "", // Fallback empty string if undefined
      email: user.email || "",
      preferences: user.preferences || [],
      streaks: user.streaks || 0,
      totalMoviesWatched,
      watchlistCount,
      lastWatchedDate: user.lastWatchedDate || null,
    };

    // Return the profile data with success status
    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);

    // Internal server error if something goes wrong
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
