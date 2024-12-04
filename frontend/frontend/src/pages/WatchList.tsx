import React, { useState, useEffect } from "react";
import { MovieCard } from "@/components/MovieCard";
import { Navigation } from "@/components/Navigation";
import { error } from "console";

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
                    // If you're using JWT, attach it to the Authorization header
                    "Authorization": `Bearer ${token}`,// Add Bearer token to the Authorization header if token exists
                    "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching
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
    const handleWatchlistToggle = async (movie: Movie) => {
        const isInWatchlist = watchlist.some((item) => item.id === movie.id);

        if (isInWatchlist) {
            // Remove from watchlist
            try {
                const token = localStorage.getItem("token");
                await fetch(`https://movielist-nl59.onrender.com/api/v1/watchlist/remove/${movie.id}`, {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        // If you're using JWT, attach it to the Authorization header
                        "Authorization": `Bearer ${token}`,// Add Bearer token to the Authorization header if token exists
                        "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching
                    },
                });
                setWatchlist(watchlist.filter((item) => item.id !== movie.id));
            } catch (err) {
                console.error("Failed to remove from watchlist:", err);
            }
        } else {
            // Add to watchlist
            try {
                const token = localStorage.getItem("token");
                await fetch("https://movielist-nl59.onrender.com/api/v1/watchlist/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // If you're using JWT, attach it to the Authorization header
                        "Authorization": `Bearer ${token}`,// Add Bearer token to the Authorization header if token exists
                        "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching
                    },
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
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container py-8">
                <h1 className="text-3xl font-bold mb-6">Your Watchlist</h1>
                {loading ? (
                    <p className="text-center text-neutral-200">Loading your watchlist...</p>
                ) : error ? (
                    <p className="text-red-500 text-center"></p>
                ) : watchlist.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {watchlist.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                id={movie.id}
                                title={movie.title}
                                poster_path={movie.poster_path}
                                inWatchlist={true}
                                onWatchlistToggle={() => {
                                    console.log("Implement toggle functionality here.");
                                }}
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