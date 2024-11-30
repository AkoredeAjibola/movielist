// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { MovieCard } from "@/components/MovieCard";
// import { Movie } from "@/components/HeroSection";

// const BASE_URL = "https://movielist-nl59.onrender.com";

// const MovieDetails: React.FC = () => {
//     const { id } = useParams<{ id: string }>(); // Extract movie ID from the route
//     const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
//     const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     // Fetch movie details
//     const fetchMovieDetails = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(`${BASE_URL}/api/v1/movie/${id}/details`);
//             const data = await response.json();
//             if (data.success) {
//                 setMovieDetails(data.content); // Set movie details
//             } else {
//                 throw new Error(data.message || "Failed to fetch movie details.");
//             }
//         } catch (err) {
//             setError((err as Error).message || "Something went wrong");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch similar movies
//     const fetchSimilarMovies = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             const response = await fetch(`${BASE_URL}/api/v1/movie/${id}/similar`, {
//                 credentials: "include", // Ensure cookies are included
//                 headers: {
//                     "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
//                     "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching
//                 }
//             });
//             const data = await response.json();
//             if (data.success) {
//                 setSimilarMovies(data.content.results || []); // Set similar movies
//             } else {
//                 throw new Error(data.message || "Failed to fetch similar movies.");
//             }
//         } catch (err) {
//             setError((err as Error).message || "Something went wrong");
//         }
//     };

//     useEffect(() => {
//         fetchMovieDetails();
//         fetchSimilarMovies();
//     }, [id]);

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>{error}</p>;

//     return (
//         <div className="container py-8">
//             {/* Movie Details Section */}
//             {movieDetails ? (
//                 <div>
//                     <h1 className="text-3xl font-bold">{movieDetails.title}</h1>
//                     <p className="text-neutral-400">{movieDetails.overview}</p>
//                     <p className="text-neutral-400">{movieDetails.genres}</p>
//                     <p className="text-neutral-400">{movieDetails.releaseDate}</p>



//                     {/* Add more details like genres, release date, etc. */}
//                 </div>
//             ) : (
//                 <p>Movie details not available.</p>
//             )}

//             {/* Similar Movies Section */}
//             <section className="mt-8">
//                 <h2 className="text-2xl font-semibold mb-4">Similar Movies</h2>
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//                     {similarMovies.length > 0 ? (
//                         similarMovies.map((movie) => (
//                             <MovieCard
//                                 key={movie.id}
//                                 id={movie.id}
//                                 title={movie.title}
//                                 poster_path={movie.poster_path}
//                                 inWatchlist={false}
//                                 onWatchlistToggle={() => { }}
//                             />
//                         ))
//                     ) : (
//                         <p>No similar movies found.</p>
//                     )}
//                 </div>
//             </section>
//         </div>
//     );
// };

// export default MovieDetails;



import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MovieCard } from '../components/MovieCard'; // You can reuse the MovieCard for similar movies
import { Movie } from '@/components/HeroSection';



const BASE_URL = "https://movielist-nl59.onrender.com";

const MovieDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Extract movie ID from the route
    const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
    const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    // Fetch movie details and similar movies
    const fetchMovieDetails = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`https://movielist-nl59.onrender.com/api/v1/movie/${id}/details`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setMovieDetails(data.content);
                setSimilarMovies(data.content.similarMovies); // Assuming API returns similar movies
            }
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    // Fetch similar movies
    const fetchSimilarMovies = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${BASE_URL}/api/v1/movie/${id}/similar`, {
                credentials: "include", // Ensure cookies are included
                headers: {
                    "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
                    "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching
                }
            });
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
        fetchSimilarMovies()
    }, [id]);

    const handleWatchlistToggle = () => {
        setIsInWatchlist(!isInWatchlist);
        // Optionally, you can call an API to update the watchlist on the backend
    };

    const handlePlayMovie = () => {
        // Implement the play movie functionality (e.g., open a player or navigate to a streaming link)
        console.log('Play movie:', movieDetails.title);
    };

    if (!movieDetails) {
        return <p>Loading movie details...</p>;
    }

    return (
        <div className="container py-8">
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
                    {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
            </div>

            {/* Similar Movies */}
            <section className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">Similar Movies</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {similarMovies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            id={movie.id}
                            title={movie.title}
                            poster_path={movie.poster_path}
                            inWatchlist={false} // Optionally, add watchlist logic for similar movies
                            onWatchlistToggle={() => { }}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default MovieDetailsPage;


