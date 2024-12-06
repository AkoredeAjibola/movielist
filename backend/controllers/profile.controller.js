import { User } from "../models/User";

// Controller to get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Assuming JWT token attaches user id to request
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      profile: {
        username: user.username,
        email: user.email,
        preferences: user.preferences,
        streaks: user.streaks,
        lastWatchedDate: user.lastWatchedDate,
        watchHistory: user.watchHistory,
        watchlist: user.watchlist,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// Controller to update user profile
export const updateUserProfile = async (req, res) => {
  const { username, email, preferences } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow updates to username, email, and preferences for simplicity
    user.username = username || user.username;
    user.email = email || user.email;
    user.preferences = preferences || user.preferences;

    await user.save();
    res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};
