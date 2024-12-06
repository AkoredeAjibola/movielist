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
  genre_ids: [];
  genres: { id: number; name: string }[];
}

export interface HeroSectionProps {
  movie: Movie;
  inWatchlist: boolean;
  onWatchlistToggle: () => void;
  userId: string; // Assuming the userId is passed from parent
  onStatusUpdate: (updatedWatchHistory) => void; // Function to update watch history in parent component
}

const genreMap: { [key: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  // Add more genres if necessary
};

export const HeroSection = ({
  movie,
  inWatchlist,
  onWatchlistToggle,
  userId,
  onStatusUpdate,
}: HeroSectionProps) => {
  const [isWatched, setIsWatched] = useState(false);

  // Function to toggle watched status
  const handleToggleWatched = async () => {
    try {
      const updatedMovie = await markAsWatched(movie.id, movie.title, !isWatched,);
      setIsWatched(!isWatched);
      onStatusUpdate(updatedMovie.watchHistory);
    } catch (error) {
      console.error("Failed to update watched status:", error.message);
    }
  };




  const markAsWatched = async (movieId: string, movieTitle: string, watched: boolean) => {
    try {

      const token = localStorage.getItem("token")
      const url = watched
        ? 'https://movielist-nl59.onrender.com/api/v1/watch-history/watched' // Mark as watched endpoint
        : 'https://movielist-nl59.onrender.com/api/v1/watch-history/${movieId}';

      const response = await fetch(url, {// Mark as unwatched endpoint, {
        method: 'PUT',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },


        body: JSON.stringify({ movieId, movieTitle, watched }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark as watched');
      }

      console.log('Watch status updated:', data);
      return data; // Return the updated data
    } catch (error) {
      console.error('Error marking movie as watched:', error);
      return null; // Ensure we return null or handle errors gracefully
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
            {movie.genre_ids.map((genreId) => (
              <span
                key={genreId}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                {genreMap[genreId] || "Unknown Genre"} {/* Show the genre name */}
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