import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const ProfilePage: React.FC = () => {
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [preferences, setPreferences] = useState<string[]>([]);
    const [watchlist, setWatchlist] = useState<{ id: string; title: string; poster_path: string; watched: boolean }[]>([]);
    const [watchHistory, setWatchHistory] = useState<{ movieId: string; movieTitle: string; watched: boolean; watchedAt: string }[]>([]);
    const [streaks, setStreaks] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("https://movielist-nl59.onrender.com/api/v1/profile/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                console.log("Fetched data: ", data)
                if (data.success) {
                    const profile = data.profile || {};
                    setUserData(profile);
                    setUsername(profile.username || "No username");
                    setEmail(profile.email || "No email");
                    setPreferences(profile.preferences || []);
                    setStreaks(profile.streaks || 0);
                    setWatchHistory(profile.watchHistory || []);
                    setWatchlist(profile.watchlist || []);
                } else {
                    setError(data.message || "Unknown error");
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Error fetching profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://movielist-nl59.onrender.com/api/v1/profile/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ username, email, preferences }),
            });

            const data = await response.json();
            if (data.success) {
                alert("Profile updated successfully!");
                setUserData({ ...userData, username, email, preferences });
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Error updating profile.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="min-h-screen bg-background">
            <main className="container py-8">
                <h1 className="text-3xl font-bold mb-6">Profile</h1>

                <div className="mb-6">
                    <h3 className="text-xl font-medium mb-4">User Information</h3>
                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-2">Username</label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">Email</label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-medium mb-4">Preferences (Genres)</h3>
                    <div className="mb-4">
                        <label htmlFor="preferences" className="block mb-2">Preferences</label>
                        <Input
                            id="preferences"
                            value={preferences.join(", ")}
                            onChange={(e) => setPreferences(e.target.value.split(", "))}
                            className="w-full"
                        />
                    </div>
                </div>

                <Button onClick={handleUpdateProfile} className="mt-4">
                    Update Profile
                </Button>

                <div className="mt-8">
                    <h3 className="text-xl font-medium mb-4">Watchlist</h3>
                    {watchlist.length > 0 ? (
                        <ul>
                            {watchlist.map((movie) => (
                                <li key={movie.id} className="flex items-center">
                                    <img src={movie.poster_path} alt={movie.title} className="w-12 h-16 mr-4" />
                                    <span>{movie.title}</span>
                                    <span className={`ml-4 ${movie.watched ? "text-green-500" : "text-red-500"}`}>
                                        {movie.watched ? "Watched" : "Not Watched"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No movies in your watchlist.</p>
                    )}
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-medium mb-4">Watch History</h3>
                    {watchHistory.length > 0 ? (
                        <ul>
                            {watchHistory.map((history) => (
                                <li key={history.movieId} className="flex items-center">
                                    <span>{history.movieTitle}</span>
                                    <span className="ml-4">{new Date(history.watchedAt).toLocaleDateString()}</span>
                                    <span className={`ml-4 ${history.watched ? "text-green-500" : "text-red-500"}`}>
                                        {history.watched ? "Watched" : "Not Watched"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No watch history available.</p>
                    )}
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-medium mb-4">Streaks</h3>
                    <p>Your current streak: {streaks}</p>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
