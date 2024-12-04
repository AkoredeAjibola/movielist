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
    ;

    const handleWatchlistToggle = async (id: string, isInWatchlist: boolean) => {
        console.log(`Toggling watchlist for Movie ID: ${id}. Is in Watchlist: ${isInWatchlist}`); // Debugging log

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found! Please log in.");
            return;
        }

        try {
            if (!isInWatchlist) {
                // Add to watchlist first
                const movieToAdd = { id, title: "Movie Title", poster_path: "/path/to/image" }; // Make sure to replace with correct movie details
                console.log("Sending request to add movie to watchlist:", movieToAdd); // Debugging log

                const addResponse = await fetch("https://movielist-nl59.onrender.com/api/v1/watchlist/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(movieToAdd),
                    credentials: "include",
                });

                const addData = await addResponse.json();
                console.log("Add response:", addData); // Log the response from add request

                if (addData.success) {
                    // Update the watchlist in UI after successful add
                    setWatchlist([...watchlist, movieToAdd]);
                } else {
                    console.error("Failed to add movie to watchlist:", addData.message);
                }
            } else {
                // If it's in the watchlist, remove it
                console.log("Sending request to remove movie from watchlist:", id); // Debugging log

                const removeResponse = await fetch(`https://movielist-nl59.onrender.com/api/v1/watchlist/remove/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                const removeData = await removeResponse.json();
                console.log("Remove response:", removeData); // Log the response from remove request

                if (removeData.success) {
                    // Remove from the watchlist in UI after successful removal
                    setWatchlist(watchlist.filter((movie) => movie.id !== id));
                } else {
                    console.error("Failed to remove movie from watchlist:", removeData.message);
                }
            }
        } catch (err) {
            console.error("Error in toggling watchlist:", err);
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
