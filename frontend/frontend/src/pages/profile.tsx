import React, { useEffect, useState } from "react";
import { StreakTracker } from "@/components/WatchStreak";

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("https://movielist-nl59.onrender.com/api/v1/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (data.success) {
                    setProfile(data.profile);
                    console.log("Fetched Profile Data:", data.profile); // Log to check the data
                } else {
                    throw new Error(data.message || "Failed to fetch profile.");
                }
            } catch (err) {
                setError(err.message || "Something went wrong.");
                console.error(err); // Log error
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>Error: {error}</p>;

    if (!profile) return <p>No profile data found.</p>; // Fallback if no profile data

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-4">Your Profile</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold">{profile.username}</h2>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>

            {/* Streak Tracker */}
            {profile.streaks && profile.streaks > 0 ? (
                <StreakTracker streaks={profile.streaks} />
            ) : (
                <p>No streaks recorded yet.</p>
            )}

            {/* Stats */}
            <div className="flex justify-between mt-4">
                <div>
                    <p className="text-sm text-muted-foreground">Total Movies Watched</p>
                    <p className="text-lg font-semibold">{profile.totalMoviesWatched}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Watchlist Count</p>
                    <p className="text-lg font-semibold">{profile.watchlistCount}</p>
                </div>
            </div>

            {/* Preferences */}
            {profile.preferences && profile.preferences.length > 0 ? (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Your Preferences</h3>
                    <ul className="flex flex-wrap gap-2">
                        {profile.preferences.map((genre, idx) => (
                            <li
                                key={idx}
                                className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                            >
                                {genre}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No preferences set.</p>
            )}
        </div>
    );
};

export default ProfilePage;
