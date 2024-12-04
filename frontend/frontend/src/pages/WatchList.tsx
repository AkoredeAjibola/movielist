import React, { useState, useEffect } from "react";
import { MovieCard } from "@/components/MovieCard";  // Import MovieCard component
import { Navigation } from "@/components/Navigation";

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
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            const response = await fetch("https://movielist-nl59.onrender.com/api/v1/watchlist/", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                },
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
    const handleWatchlistToggle = async (id: string) => {
        const isInWatchlist = watchlist.some((movie) => movie.id === id);

        if (isInWatchlist) {
            // Remove from watchlist
            try {
                const token = localStorage.getItem("token");
                await fetch(`https://movielist-nl59.onrender.com/api/v1/watchlist/remove/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                        "Cache-Control": "no-cache, no-store, must-revalidate",
                    },
                    credentials: "include",
                });
                setWatchlist(watchlist.filter((movie) => movie.id !== id)); // Remove from state
            } catch (err) {
                console.error("Failed to remove from watchlist:", err);
            }
        } else {
            // Add to watchlist
            const movieToAdd = { id, title: "Movie Title", poster_path: "/path/to/image" };  // Update this based on your data structure
            try {
                const token = localStorage.getItem("token");
                await fetch("https://movielist-nl59.onrender.com/api/v1/watchlist/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                        "Cache-Control": "no-cache, no-store, must-revalidate",
                    },
                    body: JSON.stringify(movieToAdd),
                    credentials: "include",
                });
                setWatchlist([...watchlist, movieToAdd]); // Add to state
            } catch (err) {
                console.error("Failed to add to watchlist:", err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container py-8">
                <h1 className="text-3xl font-bold mb-6">Your Watchlist</h1>
                {loading ? (
                    <p className="text-center text-neutral-200">Loading your watchlist...</p>
                ) : watchlist.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {watchlist.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                id={movie.id}
                                title={movie.title}
                                poster_path={movie.poster_path}
                                inWatchlist={true} // Already in the watchlist
                                onWatchlistToggle={handleWatchlistToggle} // Pass the function to toggle watchlist
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-neutral-200">Your watchlist is empty. Start adding movies now!</p>
                )}
            </main>
        </div>
    );
};

export default WatchlistPage;
