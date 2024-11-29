import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MovieCard } from "@/components/MovieCard";
import { Movie } from "@/components/HeroSection";

const BASE_URL = "https://movielist-nl59.onrender.com";

const MovieDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Extract movie ID from the route
    const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
    const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch movie details
    const fetchMovieDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/v1/movie/${id}`);
            const data = await response.json();
            if (data.success) {
                setMovieDetails(data.content); // Set movie details
            } else {
                throw new Error(data.message || "Failed to fetch movie details.");
            }
        } catch (err) {
            setError((err as Error).message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Fetch similar movies
    const fetchSimilarMovies = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/v1/movie/${id}/similar`);
            const data = await response.json();
            if (data.success) {
                setSimilarMovies(data.content.results || []); // Set similar movies
            } else {
                throw new Error(data.message || "Failed to fetch similar movies.");
            }
        } catch (err) {
            setError((err as Error).message || "Something went wrong");
        }
    };

    useEffect(() => {
        fetchMovieDetails();
        fetchSimilarMovies();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container py-8">
            {/* Movie Details Section */}
            {movieDetails ? (
                <div>
                    <h1 className="text-3xl font-bold">{movieDetails.title}</h1>
                    <p className="text-neutral-400">{movieDetails.overview}</p>
                    {/* Add more details like genres, release date, etc. */}
                </div>
            ) : (
                <p>Movie details not available.</p>
            )}

            {/* Similar Movies Section */}
            <section className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Similar Movies</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {similarMovies.length > 0 ? (
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
                        <p>No similar movies found.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default MovieDetails;
