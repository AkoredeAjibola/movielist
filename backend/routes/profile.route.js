import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile, updateUserProfile } from "../controllers/profile.controller.js";

const router = express.Router();


router.get("/", protectRoute, getUserProfile);

router.put("/update", protectRoute, updateUserProfile);

export default router;