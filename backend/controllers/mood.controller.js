 import { fetchFromTMDB } from "../services/tmdb.service.js";

// const moodToGenres = {
//   Happy: ["Comedy", "Family", "Animation"],
//   Sad: ["Drama", "Biography", "History"],
//   Exciting: ["Action", "Adventure", "Sci-Fi"],
//   Romantic: ["Romance", "Drama", "Comedy"],
//   Thrilling: ["Thriller", "Mystery", "Crime"],
//   Relaxing: ["Fantasy", "Family", "Musical"],
// };

// export async function fetchMoviesByMood(req, res) {
//   const { mood } = req.params;

//   if (!moodToGenres[mood]) {
//     return res.status(400).json({ success: false, message: "Invalid mood" });
//   }

//   try {
//     const genreList = moodToGenres[mood];
//     const genreQuery = genreList.join(","); // Convert genres to a comma-separated string

//     const data = await fetchFromTMDB(
//       `https://api.themoviedb.org/3/discover/movie?with_genres=${genreQuery}&sort_by=popularity.desc`
//     );

//     res.json({ success: true, content: data.results });
//   } catch (error) {
//     console.error("Error fetching mood-based movies:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// }


const moodToGenres = {
  Happy: [35, 10751, 16],   // Comedy, Family, Animation
  Sad: [18, 36, 99],        // Drama, Biography, History
  Exciting: [28, 12, 878],  // Action, Adventure, Sci-Fi
  Romantic: [10749, 18, 35], // Romance, Drama, Comedy
  Thrilling: [53, 9648, 80], // Thriller, Mystery, Crime
  Relaxing: [14, 10751, 10402], // Fantasy, Family, Musical
};

export async function fetchMoviesByMood(req, res) {
  const { mood } = req.params;

  if (!moodToGenres[mood]) {
    return res.status(400).json({ success: false, message: "Invalid mood" });
  }

  try {
    const genreList = moodToGenres[mood];
    const genreQuery = genreList.join(","); // Convert genres to a comma-separated string

    console.log(`Querying with genres: ${genreQuery}`);
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${genreQuery}&sort_by=popularity.desc&api_key=YOUR_TMDB_API_KEY`
    );

    console.log("TMDB Response Data:", data); // Debugging log

    if (data.results.length === 0) {
      return res.status(404).json({ success: false, message: "No movies found for this mood" });
    }

    res.json({ success: true, content: data.results });
  } catch (error) {
    console.error("Error fetching mood-based movies:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
