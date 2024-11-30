import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MovieCard } from "../components/MovieCard";
import { Movie } from "@/components/HeroSection";
import { Navigation } from "@/components/Navigation";

const BASE_URL = "https://movielist-nl59.onrender.com";

const MovieDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
    const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [error, setError] = useState<string>("");

    const fetchMovies = async (
        endpoint: string,
        setter: React.Dispatch<React.SetStateAction<Movie[]>>
    ): Promise<void> => {
        const token = localStorage.getItem("token");

        try {
            console.log(`Fetching from URL: ${BASE_URL}/${endpoint}`);

            const response = await fetch(`${BASE_URL}/${endpoint}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            // Check if response is okay
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the response as JSON
            const data = await response.json();
            console.log("API response:", data); // Log entire response

            // Ensure success and correct structure
            if (data.success && Array.isArray(data.similar)) {
                console.log("Fetched similar movies:", data.similar); // Log similar movies
                setter(data.similar); // Update state with the results
            } else {
                console.error("Unexpected data format. Expected 'similar' to be an array.", data);
                throw new Error("Failed to fetch movies. Unexpected data format.");
            }
        } catch (err) {
            console.error("Error fetching movies:", err);
            setError((err as Error).message || "Something went wrong");
        }
    };


    const fetchMovieDetails = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${BASE_URL}/api/v1/movie/${id}/details`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log("Movie Details Response:", data);

            if (data.success) {
                setMovieDetails(data.content);
            } else {
                console.error("Failed to fetch movie details:", data.message);
            }
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    };

    useEffect(() => {
        fetchMovieDetails();
        fetchMovies(`api/v1/movie/${id}/similar`, setSimilarMovies);
    }, [id]);

    const handleWatchlistToggle = () => {
        setIsInWatchlist(!isInWatchlist);
    };

    const handlePlayMovie = () => {
        if (!movieDetails) return;
        console.log("Play movie:", movieDetails.title);
    };

    if (!movieDetails) {
        return <p>Loading movie details...</p>;
    }

    const GENRE_MAPPING: { [key: number]: string } = {
        16: "Animation",
        14: "Fantasy",
        28: "Action",
        35: "Comedy",
        878: "Science Fiction",
        12: "Adventure",
        10751: "Family",
        // Add more mappings as needed
    };


    return (
        <div>
            <Navigation />
            {/* Full-screen Movie Poster */}
            <div className="relative">
                <img
                    src={`https://image.tmdb.org/t/p/original${movieDetails.backdropPath || movieDetails.poster_path}`}
                    alt={movieDetails.title}
                    className="w-full h-auto"
                />
                {/* Optional overlay for better text visibility */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>

            {/* Movie Details */}
            <div className="container py-8 text-white">
                <h1 className="text-4xl font-bold">{movieDetails.title}</h1>
                <div className="mt-4 flex flex-col md:flex-row md:items-center">
                    {/* Release Date */}
                    <span className="text-lg font-medium text-gray-400">
                        Release Date: {movieDetails.release_date || "N/A"}
                    </span>

                    {/* Separator for aesthetics */}
                    <span className="hidden md:block mx-4 text-gray-600">|</span>

                    {/* Genres */}
                    <div className="mt-2 md:mt-0">
                        <span className="text-lg font-medium text-gray-400">
                            Genres:{" "}
                            {movieDetails.genre_ids && movieDetails.genre_ids.length > 0 ? (
                                movieDetails.genre_ids
                                    .map((id) => GENRE_MAPPING[id] || "Unknown") // Map IDs to names
                                    .join(", ")
                            ) : (
                                "N/A"
                            )}
                        </span>
                    </div>

                </div>

                {/* Overview */}
                <p className="mt-6 text-lg">{movieDetails.overview}</p>

                {/* Play and Watchlist Buttons */}
                <div className="mt-8 flex gap-4">
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                        onClick={handlePlayMovie}
                    >
                        Play
                    </button>
                    <button
                        className="py-2 px-4 border border-blue-500 text-blue-500 rounded"
                        onClick={handleWatchlistToggle}
                    >
                        {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                    </button>
                </div>
            </div>

            {/* Similar Movies */}
            <section className="container mt-8 text-white">
                <h3 className="text-2xl font-semibold mb-4">Similar Movies</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Array.isArray(similarMovies) && similarMovies.length > 0 ? (
                        similarMovies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                id={movie.id}
                                title={movie.title}
                                poster_path={movie.poster_path}
                                inWatchlist={false}
                                onWatchlistToggle={() => console.log(`Toggled watchlist for ${movie.id}`)}
                            />
                        ))
                    ) : (
                        <p>No similar movies available</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default MovieDetailsPage;