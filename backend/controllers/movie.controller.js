import { fetchFromTMDB } from "../services/tmdb.service.js";
import Movie from "../models/movie.js"

export async function getTrendingMovie(req, res) {
	try {
	  // Fetch trending movies from TMDB API
	  const data = await fetchFromTMDB('https://api.themoviedb.org/3/trending/movie/day?language=en-US');
	  
	  // Check if there are results and pick a random movie from the list
	  if (data && Array.isArray(data.results) && data.results.length > 0) {
		const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
		res.json({ success: true, content: randomMovie });
	  } else {
		res.status(404).json({ success: false, message: "No trending movies found" });
	  }
	} catch (error) {
	  res.status(500).json({ success: false, message: "Internal Server Error" });
	}
  }
  

export async function getPopularMovie(req, res) {
	try {
	  const data = await fetchFromTMDB('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1');
	  
	  if (!data || data.length === 0) {
		return res.status(404).json({ success: false, message: "No popular movies found" });
	  }
  
	  res.json({ success: true, content: data });
	} catch (error) {
	  console.error("Error in fetching popular movies:", error);
	  res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
	}
  }


// Add Movie
export async function addMovie  (req, res)  {
	try {
	  const movie = new Movie(req.body);
	  await movie.save();
	  res.status(201).json(movie);
	} catch (err) {
	  res.status(400).json({ error: err.message });
	}
  };

export async function getMovieTrailers(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
		res.json({ success: true, trailers: data.results });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}

		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getMovieDetails(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
		res.status(200).json({ success: true, content: data });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}

		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getSimilarMovies(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);
		res.status(200).json({ success: true, similar: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getMoviesByCategory(req, res) {
	const { category } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`);
		res.status(200).json({ success: true, content: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}
