import { Button } from "@/components/ui/button";
import { Bookmark, Play } from "lucide-react";
import { useState } from "react";


export interface Movie {
  release_date: string;
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdropPath: string;
  genre_ids: number[];
}

export interface HeroSectionProps {
  movie: Movie;
  inWatchlist: boolean;
  onWatchlistToggle: () => void;
  userId: string; // Assuming the userId is passed from parent
  onStatusUpdate: (updatedWatchHistory) => void; // Function to update watch history in parent component
}

export const HeroSection = ({ movie, inWatchlist, onWatchlistToggle, userId, onStatusUpdate }: HeroSectionProps) => {
  const [isWatched, setIsWatched] = useState(false);

  // Function to toggle watched status
  const handleToggleWatched = async () => {
    try {
      // Toggle watched status
      const updatedMovie = await markMovieAsWatched(userId, movie.id, !isWatched);
      setIsWatched(!isWatched);  // Toggle local state
      onStatusUpdate(updatedMovie.watchHistory); // Update the parent's watch history state
    } catch (error) {
      alert("Failed to update watched status.");
    }
  };




  const markMovieAsWatched = async (userId: string, movieId: string, watched: boolean) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve user's token for authentication
      const response = await fetch('https://movielist-nl59.onrender.com/api/v1/watchlist/watched', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, movieId, watched }),
      });

      if (!response.ok) {
        throw new Error("Failed to update movie status.");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating movie status:", error.message);
      throw error;
    }
  };


  if (!movie) {
    return <p className="text-center text-neutral-200">No movie to display</p>;
  }

  return (
    <div className="relative h-[80vh] w-full">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdropPath})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background to-background/20" />
      </div>
      <div className="container relative z-10 flex h-full items-center">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{movie.title}</h1>
          <div className="flex flex-wrap gap-2">
            {movie.genre_ids.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                {genre}
              </span>
            ))}
          </div>
          <p className="text-lg text-muted-foreground">{movie.overview}</p>
          <div className="flex gap-4">
            <Button onClick={handleToggleWatched} className="text-white bg-blue-600 px-4 py-2 rounded">
              {isWatched ? "Unmark as Watched" : "Mark as Watched"}
            </Button>
            <Button variant="outline" size="lg" onClick={onWatchlistToggle}>
              <Bookmark
                className={`mr-2 h-4 w-4 ${inWatchlist ? "fill-current" : ""}`}
              />
              {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          </div>
        </div>
      </div>



    </div>
  );
};
