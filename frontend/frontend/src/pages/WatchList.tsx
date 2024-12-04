import React, { useState, useEffect } from "react";
import { MovieCard } from "@/components/MovieCard";

interface Movie {
    id: string;
    title: string;
    poster_path: string;
}

const WatchlistPage: React.FC = () => {
    const [watchlist, setWatchlist] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch the watchlist from the backend
    const fetchWatchlist = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://movielist-nl59.onrender.com/api/v1/watchlist/", {
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
    const handleWatchlistToggle = async (movie: Movie) => {
        const isInWatchlist = watchlist.some((item) => item.id === movie.id);

        if (isInWatchlist) {
            // Remove from watchlist
            try {
                await fetch(`https://movielist-nl59.onrender.com/api/v1/watchlist/remove/${movie.id}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                setWatchlist(watchlist.filter((item) => item.id !== movie.id));
            } catch (err) {
                console.error("Failed to remove from watchlist:", err);
            }
        } else {
            // Add to watchlist
            try {
                await fetch("https://movielist-nl59.onrender.com/api/v1/watchlist/add", {
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
                <p className="text-gray-500">Your watchlist is empty. Start adding movies now!</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {watchlist.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            id={movie.id}
                            title={movie.title}
                            poster_path={movie.poster_path}
                            inWatchlist={true}
                            onWatchlistToggle={() => handleWatchlistToggle(movie)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WatchlistPage;
