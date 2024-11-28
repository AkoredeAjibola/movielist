import { Button } from "@/components/ui/button";
import { Bookmark, Play } from "lucide-react";

export interface Movie {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdropPath: string;
  genres: string[];
}

export interface HeroSectionProps {
  movie: Movie;
  inWatchlist: boolean;
  onWatchlistToggle: () => void;
}
export const HeroSection = ({ movie, inWatchlist, onWatchlistToggle }: HeroSectionProps) => {
  console.log("HeroSection received movie:", movie);

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
            {movie.genres.map((genre) => (
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
              <Play className="mr-2 h-4 w-4" /> Play Now
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
