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


            const response = await fetch(`${BASE_URL}/${endpoint}`, {
                credentials: "include", // Include cookies in the request
                headers: {
                    // If you're using JWT, attach it to the Authorization header
                    "Authorization": token ? `Bearer ${token}` : "", // Add Bearer token to the Authorization header if token exists
                    "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching
                },
            });
            const data = await response.json();
            console.log("Similar Movies API response:", data);  // Log the response


            if (data.success && Array.isArray(data.content?.results)) {
                setter(data.content?.results); // Set the movie in the trendingMovies array as a single-item array
            } else {
                throw new Error("Failed to fetch movies.");
            }
        } catch (err) {
            setError((err as Error).message || "Something went wrong");
        }
    };


    // Fetch movie details including similar movies if available
    const fetchMovieDetails = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${BASE_URL}/api/v1/movie/${id}/details`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log("Movie Details Response:", data); // Debugging response
            if (data.success) {
                setMovieDetails(data.content);
                setSimilarMovies(data.content.similarMovies || []); // Set similar movies or empty array
            } else {
                console.error("Failed to fetch movie details:", data.message);

            }
        } catch (error) {
            console.error("Error fetching movie details:", error);

        }
    };

    // Fetch similar movies from a separate endpoint if necessary
    // const fetchSimilarMovies = async () => {
    //     const token = localStorage.getItem("token");
    //     try {
    //         const response = await fetch(`${BASE_URL}/api/v1/movie/${id}/similar`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         // Check if the response is okay (status code 200-299)
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! Status: ${response.status}`);
    //         }

    //         const data = await response.json();
    //         console.log("Similar Movies Response:", data); // Debugging response

    //         // Check if the data contains the expected structure
    //         if (data.success && Array.isArray(data.content?.results)) {
    //             setSimilarMovies(data.content.results); // Set the array of similar movies
    //         } else {
    //             console.error("Unexpected data structure:", data);
    //             throw new Error("Failed to fetch similar movies or invalid response format.");
    //         }
    //     } catch (err) {
    //         console.error("Error fetching similar movies:", err);
    //         setError((err as Error).message || "Something went wrong");
    //     }
    // };

    // UseEffect to fetch details and similar movies
    useEffect(() => {
        fetchMovieDetails();
        fetchMovies(`api/v1/movie/${id}/similar`, setSimilarMovies)
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

    return (
        <div className="container py-8">
            <Navigation />
            <h2 className="text-3xl font-semibold">{movieDetails.title}</h2>
            <p>{movieDetails.overview}</p>

            {/* Movie Poster and Play Button */}
            <div className="mt-4">
                <img
                    src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                    alt={movieDetails.title}
                    className="w-full max-w-sm"
                />
                <button
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={handlePlayMovie}
                >
                    Play
                </button>
                <button
                    className="ml-4 py-2 px-4 border border-blue-500 text-blue-500 rounded"
                    onClick={handleWatchlistToggle}
                >
                    {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                </button>
            </div>

            {/* Similar Movies */}
            <section className="mt-8">
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
                                onWatchlistToggle={() => { }}
                            />
                        ))
                    ) : (
                        <p>No similar movies available</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default MovieDetailsPage;


