import express from "express";
import {
	addMovie,
	getMovieDetails,
	getMoviesByCategory,
	getMovieTrailers,
	getPopularMovie,
	getSimilarMovies,
	getTrendingMovie,
} from "../controllers/movie.controller.js";

const router = express.Router();

router.get("/trending", getTrendingMovie);
router.get("/popular", getPopularMovie);
router.get("/addmovie", addMovie);
router.get("/:id/trailers", getMovieTrailers);
router.get("/:id/details", getMovieDetails);
router.get("/:id/similar", getSimilarMovies);
router.get("/:category", getMoviesByCategory);

export default router;
