import express from "express";
import { fetchMoviesByMood } from "../controllers/mood.controller.js";

const router = express.Router();

router.get("/:mood", fetchMoviesByMood);

export default router;
