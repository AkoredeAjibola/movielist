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
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Similar Movies API response:", data);

            if (data.success && Array.isArray(data.content?.results)) {
                setter(data.content?.results);
            } else {
                throw new Error("Failed to fetch movies.");
            }
        }
        catch (err) {
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
};

export default MovieDetailsPage;
