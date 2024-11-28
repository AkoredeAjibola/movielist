import React, { useState } from "react";
import { MoodSelector } from "@/components/MoodSelector";
import { MovieCard } from "@/components/MovieCard";

const BASE_URL = "http://localhost:3000";
export const MoodRecommendations: React.FC = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("");

  const fetchMoviesByMood = async (mood: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/v1/mood/${mood}`, {
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        console.log("Fetched Movies:", data.content); // Log the fetched movies
        setMovies(data.content); // Ensure this sets the correct data
      } else {
        throw new Error(data.message || "Failed to fetch movies");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Find Movies by Your Mood</h1>
      <MoodSelector selectedMood={selectedMood} onSelectMood={fetchMoviesByMood} />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              poster_path={movie.poster_path}  // Use posterPath instead of poster_path
              inWatchlist={false}
              onWatchlistToggle={() => { }}
            />
          ))
        ) : (
          <p>No movies found for the selected mood</p> // Fallback message if no movies found
        )}
      </div>
    </div>
  );
};

export default MoodRecommendations