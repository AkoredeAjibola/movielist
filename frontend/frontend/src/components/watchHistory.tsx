import React, { useEffect, useState } from 'react';

interface WatchHistoryItem {
    id: string;
    movieId: string;
    movieTitle: string;
    watchedAt: string;
}

export const WatchHistory: React.FC = () => {
    const [history, setHistory] = useState<WatchHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://movielist-nl59.onrender.com/api/v1/watch-history', {
                credentials: 'include',
            });
            const data = await response.json();

            if (data.success) {
                setHistory(data.history);
            } else {
                throw new Error(data.message || 'Failed to fetch history.');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const deleteHistoryItem = async (id: string) => {
        try {
            await fetch(`https://movielist-nl59.onrender.com/api/v1/watch-history/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            setHistory(history.filter((item) => item.id !== id));
        } catch (err) {
            console.error('Failed to delete history item:', err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div className="container py-8">
            <h2 className="text-2xl font-semibold mb-4">Watch History</h2>
            {loading ? (
                <p>Loading watch history...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : history.length > 0 ? (
                <ul>
                    {history.map((item) => (
                        <li key={item.id} className="flex justify-between items-center">
                            <div>
                                <h3>{item.movieTitle}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Watched on {new Date(item.watchedAt).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                className="text-red-500 hover:underline"
                                onClick={() => deleteHistoryItem(item.id)}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No watch history found.</p>
            )}
        </div>
    );
};
