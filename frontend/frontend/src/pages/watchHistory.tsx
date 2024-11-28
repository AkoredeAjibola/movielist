import React, { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";

interface WatchHistoryItem {
  id: string;
  movieId: string;
  movieTitle: string;
  watchedAt: string;
}

const WatchHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://movielist-nl59.onrender.com/api/v1/watch-history", {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setHistory(data.history);
      } else {
        throw new Error(data.message || "Failed to fetch history.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      await fetch(`https://movielist-nl59.onrender.com/api/v1/watch-history/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete history item:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8">
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
                  <h3 className="text-xl font-semibold">{item.movieTitle}</h3>
                  <p className="text-sm text-muted-foreground">
                    Watched on {new Date(item.watchedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => deleteHistoryItem(item.id)}
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
