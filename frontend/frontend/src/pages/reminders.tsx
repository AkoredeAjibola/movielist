import React, { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";


interface Reminder {
    _id: string;
    movieId: string;
    movieTitle: string;
    reminderDate: string;
}

const RemindersPage: React.FC = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { toast } = useToast();

    const fetchReminders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://movielist-nl59.onrender.com/api/v1/reminder/", {
                credentials: "include",
                headers: {
                    // If you're using JWT, attach it to the Authorization header
                    "Authorization": `Bearer ${token}`,// Add Bearer token to the Authorization header if token exists
                    "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching
                },
            });
            const data = await response.json();

            if (data.success) {
                setReminders(data.reminders);
            } else {
                throw new Error(data.message || "Failed to fetch reminders.");
            }
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };


    const deleteReminder = async (id: string) => {
        console.log("Attempting to delete reminder with ID:", id); // Debug log
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`https://movielist-nl59.onrender.com/api/v1/reminder/${id}`, {
                method: "DELETE",
                credentials: "include", // Include cookies for authentication
                headers: {
                    // If you're using JWT, attach it to the Authorization header
                    "Authorization": `Bearer ${token}`,// Add Bearer token to the Authorization header if token exists
                    "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching
                },
            });

            if (!response.ok) {
                console.error(`Failed to delete reminder: ${response.statusText}`);
                throw new Error(`Failed to delete reminder: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Delete response:", data); // Debug log

            if (data.success) {
                setReminders((prev) => prev.filter((reminder) => reminder._id !== id)); // Update UI
                toast({
                    title: "Reminder deleted",
                    description: "The reminder has been removed.",
                });
            } else {
                throw new Error(data.message || "Failed to delete reminder.");
            }
        } catch (error) {
            console.error("Error deleting reminder:", error.message);
            toast({
                title: "Error",
                description: error.message || "Failed to delete reminder.",
                variant: "destructive",
            });
        }
    };


    useEffect(() => {
        fetchReminders();
    }, []);


    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container py-8">
                <h1 className="text-3xl font-bold mb-6">Your Reminders</h1>
                {loading ? (
                    <p className="text-center text-neutral-200">Loading reminders...</p>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : reminders.length > 0 ? (
                    <div className="space-y-4">
                        {reminders.map((reminder) => (
                            <div
                                key={reminder._id || `${reminder.movieTitle}-${reminder.reminderDate}`} // Fallback for key
                                className="flex justify-between items-center border p-4 rounded-lg bg-neutral-800"
                            >
                                <div>
                                    <h3 className="text-xl font-semibold">{reminder.movieTitle}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Reminder set for {new Date(reminder.reminderDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => deleteReminder(reminder._id)}
                                    className="text-red-500"
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-neutral-200">No reminders set.</p>
                )}
            </main>
        </div>
    );
};

export default RemindersPage;
