import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button"; // Assuming you have a button component
import { Input } from "../components/ui/input"; // Assuming you have an input component

const ProfilePage: React.FC = () => {
    const [userData, setUserData] = useState(null); // Store user data
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [preferences, setPreferences] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // Fetch user profile data on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch("https://movielist-nl59.onrender.com/api/v1/profile/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setUserData(data.profile);
                    setUsername(data.profile.username);
                    setEmail(data.profile.email);
                    setPreferences(data.profile.preferences);
                } else {
                    setError(data.message);
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

    // Handle form submission to update the profile
    const handleUpdateProfile = async () => {
        try {
            const response = await fetch("https://movielist-nl59.onrender.com/api/v1/profile/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
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
                        <label htmlFor="username" className="block mb-2">
                            Username
                        </label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">
                            Email
                        </label>
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
                    <h3 className="text-xl font-medium mb-4">Preferences</h3>
                    <div className="mb-4">
                        <label htmlFor="preferences" className="block mb-2">
                            Preferences (Genres)
                        </label>
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
            </main>
        </div>
    );
};

export default ProfilePage;
