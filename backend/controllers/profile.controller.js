import { User } from "../models/user.model.js";

/**
 * Get user profile
 * @param {Object} req - The request object (contains user ID from middleware)
 * @param {Object} res - The response object
 */
export const getProfile = async (req, res) => {
  try {
    // Extract user ID from the token (middleware should set this)
    const userId = req.user?.id;

    // If no user ID is found, return unauthorized response
    if (!userId) {
      console.log("Unauthorized access attempt, no user ID found");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    console.log("Fetching profile for user ID:", userId);

    // Query the database for the user's profile data
    const user = await User.findById(userId)
      .select("username email preferences streaks watchHistory watchlist lastWatchedDate")
      .lean(); // Use lean() for plain JavaScript object

    // If the user is not found, return a 404 response
    if (!user) {
      console.log("User not found for ID:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compute derived data for the profile
    const totalMoviesWatched = user.watchHistory?.length || 0;
    const watchlistCount = user.watchlist?.length || 0;

    // Construct the response object
    const profile = {
      username: user?.username || "Unknown",
      email: user?.email || "No email provided",
      preferences: user?.preferences || [],
      streaks: user?.streaks || 0,
      totalMoviesWatched,
      watchlistCount,
      lastWatchedDate: user?.lastWatchedDate || null,
    };

    console.log("Returning profile data:", profile);

    // Return the profile response
    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);

    // Catch and return server errors
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
