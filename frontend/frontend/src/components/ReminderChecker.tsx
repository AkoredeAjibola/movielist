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

    // Fetch reminders when the component mounts
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

    const checkReminders = () => {
        const now = new Date();
        console.log("Checking reminders at:", now.toISOString());

        const upcomingReminders = reminders.filter((reminder) => {
            const reminderDate = new Date(reminder.reminderDate);
            console.log(`Checking reminder: ${reminder.movieTitle} at ${reminderDate.toISOString()} against current time ${now.toISOString()}`);
            return reminderDate <= now; // Only get past reminders
        });

        if (upcomingReminders.length > 0) {
            upcomingReminders.forEach((reminder) => {
                console.log(`Reminder triggered: ${reminder.movieTitle}`);

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
                    duration: 30000, // Show the toast for 30 seconds
                });

                // Remove reminder locally after showing the toast
                setReminders((prev) => prev.filter((r) => r._id !== reminder._id));

                // Optionally, delete the reminder from the backend
                deleteReminder(reminder._id);
            });
        }
    };

    // Fetch reminders when component mounts
    useEffect(() => {
        console.log("Fetching reminders...");
        fetchReminders();

        const interval = setInterval(() => {
            console.log("Checking reminders periodically");
            checkReminders(); // Run the reminder check every minute
        }, 60000); // Every minute

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []); // Only run this on mount

    // Effect to check reminders and update state
    useEffect(() => {
        // Here we're making sure that checkReminders uses the latest `reminders` state
        console.log("Checking reminders after state update");
        checkReminders();
    }, [reminders]); // Run this effect when `reminders` state changes

    return null; // This component doesn't render anything visible
};
