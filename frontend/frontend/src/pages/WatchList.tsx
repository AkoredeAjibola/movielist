import React, { useState, useEffect } from "react";
import { MovieCard } from "@/components/MovieCard"; // Import MovieCard component
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
        const userId = localStorage.getItem("userId"); // Assuming you store the userId in localStorage

        if (!userId) {
            console.error("User not logged in");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`https://movielist-nl59.onrender.com/api/v1/watchlist/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setWatchlist(data.content); // Assuming `data.content` holds the watchlist data
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
    const handleWatchlistToggle = async (movieId: string, newStatus: boolean) => {
        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId"); // Get userId

            if (!userId) {
                console.error("User not logged in");
                return;
            }

            const url = newStatus
                ? "https://movielist-nl59.onrender.com/api/v1/watchlist/add"
                : `https://movielist-nl59.onrender.com/api/v1/watchlist/remove/${movieId}`;

            const method = newStatus ? "POST" : "DELETE";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId, movieId }),
            });

            if (!response.ok) {
                throw new Error("Failed to update watchlist");
            }

            const data = await response.json();
            console.log("Watchlist updated:", data);

            // Update the local state to reflect the change immediately
            setWatchlist((prev) =>
                newStatus
                    ? [...prev, data.movie] // Add movie returned from the API
                    : prev.filter((movie) => movie.id !== movieId) // Remove the movie from the watchlist
            );
        } catch (error) {
            console.error("Error updating watchlist:", error);
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
                                inWatchlist={watchlist.some((item) => item.id === movie.id)}
                                onWatchlistToggle={handleWatchlistToggle} // Pass function to toggle watchlist
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
