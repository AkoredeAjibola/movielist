import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MovieCard } from "../components/MovieCard";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";

const BASE_URL = "https://movielist-nl59.onrender.com";

export interface Movie {
    release_date: string;
    id: string;
    title: string;
    overview: string;
    poster_path: string;
    backdropPath: string;
    genre_ids: [];
    genres: { id: number; name: string }[];
}

export interface MovieDetailsProps {
    movie: Movie;
    inWatchlist: boolean;
    onWatchlistToggle: () => void;
    userId: string; // Assuming the userId is passed from parent
    onStatusUpdate: (updatedWatchHistory) => void; // Function to update watch history in parent component
}

const MovieDetailsPage: React.FC = ({
    movie,
    inWatchlist,
    onWatchlistToggle,
    userId,
    onStatusUpdate,
}: MovieDetailsProps) => {
    const { id } = useParams<{ id: string }>();
    const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
    const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
    const [isInWatchlist, setIsInWatchlist] = useState(inWatchlist);
    const [error, setError] = useState<string>("");
    const [isWatched, setIsWatched] = useState(false);
    const [loading, setLoading] = useState(true); // For loading state

    const handleToggleWatched = async () => {
        if (!movie || !movie.id) {
            console.error("Movie object is invalid or missing 'id'");
            return;
        }

        try {
            const updatedMovie = await markAsWatched(movie.id, movie.title, !isWatched);
            setIsWatched(!isWatched);
            onStatusUpdate(updatedMovie.watchHistory);
        } catch (error) {
            console.error("Failed to update watched status:", error.message);
        }
    };


    const markAsWatched = async (movieId: string, movieTitle: string, watched: boolean) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User is not authenticated");

        try {
            const url = watched
                ? 'https://movielist-nl59.onrender.com/api/v1/watch-history/watched' // Mark as watched endpoint
                : `https://movielist-nl59.onrender.com/api/v1/watch-history/${movieId}`;

            const method = watched ? 'PUT' : 'DELETE';

            const response = await fetch(url, {
                method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                },
                body: JSON.stringify({ movieId, movieTitle, watched }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to mark as watched');
            }

            return data; // Return the updated data
        } catch (error) {
            console.error('Error marking movie as watched:', error);
            throw error;
        }
    };

    const fetchMovies = async (endpoint: string, setter: React.Dispatch<React.SetStateAction<Movie[]>>) => {
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
            if (data.success && Array.isArray(data.similar)) {
                setter(data.similar);
            } else {
                throw new Error("Failed to fetch similar movies");
            }
        } catch (err) {
            setError("Error fetching movies: " + (err instanceof Error ? err.message : "Unknown error"));
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

            if (data.success) {
                setMovieDetails({
                    ...data.content,
                    genres: data.content.genres || [],
                });
            } else {
                throw new Error(data.message || "Failed to fetch movie details");
            }
        } catch (error) {
            setError("Error fetching movie details: " + (error instanceof Error ? error.message : "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovieDetails();
        fetchMovies(`api/v1/movie/${id}/similar`, setSimilarMovies);
    }, [id]);

    const handleWatchlistToggle = () => {
        setIsInWatchlist(!isInWatchlist);
    };

    if (loading) {
        return <p>Loading movie details...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div>
            <Navigation />
            <div className="relative">
                <img
                    src={`https://image.tmdb.org/t/p/original${movieDetails.backdropPath || movieDetails.poster_path}`}
                    alt={movieDetails.title}
                    className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>

            <div className="container py-8 text-white">
                <h1 className="text-4xl font-bold">{movieDetails.title}</h1>
                <div className="mt-4 flex flex-col md:flex-row md:items-center">
                    <span className="text-lg font-medium text-gray-400">
                        Release Date: {movieDetails.release_date || "N/A"}
                    </span>
                    <span className="hidden md:block mx-4 text-gray-600">|</span>
                    <div className="mt-2 md:mt-0">
                        <span className="text-lg font-medium text-gray-400">
                            Genres:{" "}
                            {movieDetails?.genres.length > 0
                                ? movieDetails.genres.map((genre) => genre.name).join(", ")
                                : "N/A"}
                        </span>
                    </div>
                </div>

                <p className="mt-6 text-lg">{movieDetails.overview}</p>

                <div className="mt-8 flex gap-4">
                    <Button onClick={handleToggleWatched} className="text-white bg-blue-600 px-4 py-2 rounded">
                        {isWatched ? "Unmark as Watched" : "Mark as Watched"}
                    </Button>
                    <button
                        className="py-2 px-4 border border-blue-500 text-blue-500 rounded"
                        onClick={handleWatchlistToggle}
                    >
                        {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                    </button>
                </div>
            </div>

            <section className="container mt-8 text-white">
                <h3 className="text-2xl font-semibold mb-4">Similar Movies</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {similarMovies.length > 0 ? (
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
