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
        console.log("Checking reminders at:", now.toISOString()); // Debugging log

        const upcomingReminders = reminders.filter((reminder) => {
            const reminderDate = new Date(reminder.reminderDate);
            console.log(`Reminder: ${reminder.movieTitle}, Scheduled: ${reminderDate}, Now: ${now}`); // Debug log
            return reminderDate <= now;
        });

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
                duration: 30000,
            });

            setReminders((prev) =>
                prev.filter((r) => r._id !== reminder._id)
            );

            deleteReminder(reminder._id); // Optionally remove from the backend
        });
    }, [reminders, toast]);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log("Checking reminders periodically"); // Debugging log
            checkReminders();
        }, 60000); // Every minute

        return () => clearInterval(interval); // Cleanup
    }, [checkReminders]);
    // Include checkReminders as a dependency

    return null; // No visible UI
};
