import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ENV_VARS } from "../config/envVars.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Unauthorized - Token Expired" });
      }
      return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
    }

    // Fetch user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Attach user to request object
    req.user = user;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
