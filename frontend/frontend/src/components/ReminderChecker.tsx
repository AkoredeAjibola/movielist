import { useEffect, useState } from "react";
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

    const checkReminders = () => {
        const now = new Date();
        reminders.forEach((reminder) => {
            const reminderDate = new Date(reminder.reminderDate);
            if (reminderDate <= now) {
                // Notify user
                toast({
                    title: "Reminder Alert!",
                    description: `It's time to watch ${reminder.movieTitle}!`,
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

                // Optionally delete reminder from backend
                deleteReminder(reminder._id);
            }
        });
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

    useEffect(() => {
        fetchReminders();
        const interval = setInterval(checkReminders, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [reminders]);

    return null; // This component doesn't render anything visible
};
