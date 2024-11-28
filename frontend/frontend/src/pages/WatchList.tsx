// import { useState, useEffect } from "react";
// import { MovieCard } from "@/components/MovieCard";

// const WatchlistPage: React.FC = () => {
//     const [watchlist, setWatchlist] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const fetchWatchlist = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch("http://localhost:3000/api/v1/watchlist", {
//                 method: "GET",
//                 credentials: "include",
//             });
//             const data = await response.json();
//             setWatchlist(data.content);
//         } catch (err) {
//             console.error("Failed to fetch watchlist:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchWatchlist();
//     }, []);

//     const handleAddToWatchlist = async (movie: { id: string; title: string; poster_path: string }) => {
//         try {
//             await fetch("http://localhost:3000/api/v1/watchlist/add", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(movie),
//                 credentials: "include",
//             });
//             fetchWatchlist(); // Refresh the watchlist
//         } catch (err) {
//             console.error("Failed to add to watchlist:", err);
//         }
//     };

//     const handleRemoveFromWatchlist = async (movieId: string) => {
//         try {
//             await fetch(`http://localhost:3000/api/v1/watchlist/remove/${movieId}`, {
//                 method: "DELETE",
//                 credentials: "include",
//             });
//             fetchWatchlist(); // Refresh the watchlist
//         } catch (err) {
//             console.error("Failed to remove from watchlist:", err);
//         }
//     };

//     return (
//         <div>
//             <h1>Your Watchlist</h1>
//             {loading ? (
//                 <p>Loading...</p>
//             ) : (
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                     {watchlist.map((movie) => (
//                         <MovieCard
//                             key={movie.id}
//                             id={movie.id}
//                             title={movie.title}
//                             poster_path={movie.poster_path}
//                             inWatchlist={true} onWatchlistToggle={function (): void {
//                                 throw new Error("Function not implemented.");
//                             }} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default WatchlistPage;

import React, { useState, useEffect } from "react";
import { MovieCard } from "@/components/MovieCard";

const WatchlistPage: React.FC = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch the watchlist from the backend
    const fetchWatchlist = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/v1/watchlist", {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            if (data.success) {
                setWatchlist(data.content);
            }
        } catch (error) {
            console.error("Failed to fetch watchlist:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWatchlist();
    }, []);

    // Handle add/remove from watchlist
    const handleWatchlistToggle = async (movieId: string) => {
        const isInWatchlist = watchlist.some((movie) => movie.id === movieId);

        if (isInWatchlist) {
            // Remove from watchlist
            try {
                await fetch(`http://localhost:3000/api/v1/watchlist/remove/${movieId}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                setWatchlist(watchlist.filter((movie) => movie.id !== movieId));
            } catch (err) {
                console.error("Failed to remove from watchlist:", err);
            }
        } else {
            // Add to watchlist
            const movie = { id: movieId, title: "Movie Title", poster_path: "/path/to/image" };  // Get movie data
            try {
                await fetch("http://localhost:3000/api/v1/watchlist/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(movie),
                    credentials: "include",
                });
                setWatchlist([...watchlist, movie]);
            } catch (err) {
                console.error("Failed to add to watchlist:", err);
            }
        }
    };


    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Your Watchlist</h1>
            {loading ? (
                <p>Loading...</p>
            ) : watchlist.length === 0 ? (
                <p>No movies in your watchlist. Add some!</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {watchlist.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            id={movie.id}
                            title={movie.title}
                            poster_path={movie.poster_path}
                            inWatchlist={true}
                            onWatchlistToggle={() => handleWatchlistToggle(movie)} // Pass the toggle function
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WatchlistPage;
