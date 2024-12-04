import { Button } from "@/components/ui/button";
import { Bookmark, Play } from "lucide-react";
import { useState } from "react";
import ReactPlayer from "react-player";

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
}
export const HeroSection = ({ movie, inWatchlist, onWatchlistToggle }: HeroSectionProps) => {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);


  const handlePlayMovie = async () => {
    try {
      const response = await fetch(`/api/stream/${movie.id}`);
      const data = await response.json();

      if (data.success) {
        setStreamUrl(data.url); // Set the streaming URL
        setIsPlaying(true); // Show the video player
      } else {
        console.error("Error fetching stream URL:", data.message);
      }
    } catch (error) {
      console.error("Error fetching stream URL:", error);
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
            <Button size="lg">
              <Play className="mr-2 h-4 w-4" onClick={handlePlayMovie} /> Play Now
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
      {/* Video Player */}
      {isPlaying && streamUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
          <ReactPlayer
            url={streamUrl}
            playing
            controls
            width="80%"
            height="80%"
          />
          <button
            className="absolute top-4 right-4 text-white bg-red-500 rounded px-4 py-2"
            onClick={() => setIsPlaying(false)}
          >
            Close
          </button>
        </div>
      )}


    </div>
  );
};
