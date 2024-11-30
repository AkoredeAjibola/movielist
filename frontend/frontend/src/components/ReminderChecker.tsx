import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Reminder {
    _id: string;
    movieId: string;
    movieTitle: string;
    reminderDate: string;
}

export const ReminderChecker: React.FC = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const { toast } = useToast();

    const fetchReminders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://movielist-nl59.onrender.com/api/v1/reminder/", {
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                },
            });
            const data = await response.json();
            if (data.success) {
                setReminders(data.reminders);
            }
        } catch (error) {
            console.error("Failed to fetch reminders:", error);
        }
    };

    const deleteReminder = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            await fetch(`https://movielist-nl59.onrender.com/api/v1/reminder/${id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error("Failed to delete reminder:", error);
        }
    };

    const checkReminders = useCallback(() => {
        const now = new Date();
        const upcomingReminders = reminders.filter((reminder) => {
            const reminderDate = new Date(reminder.reminderDate);
            return reminderDate <= now;
        });

        // Show a notification for each due reminder
        upcomingReminders.forEach((reminder) => {
            toast({
                title: "Reminder Alert!",
                description: `It's time to watch "${reminder.movieTitle}"!`,
                action: (
                    <button
                        className="text-blue-500"
                        onClick={() => console.log(`Navigating to movie ${reminder.movieId}`)}
                    >
                        Watch Now
                    </button>
                ),
            });

            // Remove the expired reminder locally
            setReminders((prev) =>
                prev.filter((r) => r._id !== reminder._id)
            );

            // Optionally delete the reminder from the backend
            deleteReminder(reminder._id);
        });
    }, [reminders, toast]);

    useEffect(() => {
        fetchReminders(); // Initial fetch
        const interval = setInterval(checkReminders, 60000); // Check every minute
        return () => clearInterval(interval); // Cleanup on unmount
    }, [checkReminders]); // Include checkReminders as a dependency

    return null; // No visible UI
};
