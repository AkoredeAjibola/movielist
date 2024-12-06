import React, { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { StreakTracker } from "@/components/WatchStreak";

interface WatchHistoryItem {
  id: string;
  movieId: string;
  title: string;
  watchedAt: string;
}

const WatchHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [streaks, setStreaks] = useState(0);
  const [error, setError] = useState("");

  // Function to fetch watch history
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://movielist-nl59.onrender.com/api/v1/watch-history", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setHistory(data.history); // Update the local state with the fetched history
        setStreaks(data.streaks || 0);
      } else {
        throw new Error(data.message || "Failed to fetch history.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a history item
  const deleteHistoryItem = async (movieId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://movielist-nl59.onrender.com/api/v1/watch-history/${movieId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete history item.");
      }

      // Remove item from local state after successful deletion
      setHistory((prevHistory) => prevHistory.filter((item) => item.movieId !== movieId));
    } catch (err) {
      console.error("Failed to delete history item:", err);
    }
  };

  // Fetch history on component mount
  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8">
        <StreakTracker streaks={streaks} />
        <h1 className="text-3xl font-bold mb-6">Watch History</h1>
        {loading ? (
          <p className="text-center text-neutral-200">Loading watch history...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border p-4 rounded-lg bg-neutral-800"
              >
                <div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Watched on {new Date(item.watchedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => deleteHistoryItem(item.movieId)}
                  className="text-red-500"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-200">No watch history found.</p>
        )}
      </main>
    </div>
  );
};

export default WatchHistoryPage;
