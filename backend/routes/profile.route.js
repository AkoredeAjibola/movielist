import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getProfile } from "../controllers/profile.controller.js";

const router = express.Router();


router.get("/", protectRoute, getProfile);

export default router;