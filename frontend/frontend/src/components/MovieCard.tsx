// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Bookmark } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { WatchReminder } from "./WatchReminder";
// import WatchlistPage from "@/pages/WatchList";



// interface MovieCardProps {
//   id: string;
//   title: string;
//   poster_path: string;
//   inWatchlist: boolean;
//   onWatchlistToggle: () => void;
// }

// export const MovieCard = ({
//   id,
//   title,
//   poster_path,
//   inWatchlist,
//   onWatchlistToggle,
// }: MovieCardProps) => {
//   const [showReminder, setShowReminder] = useState(false);
//   const[isInWatchlist, setIsInWatchlist]  = useState(inWatchlist);

//   const imageUrl = `https://image.tmdb.org/t/p/w154${poster_path}`;


//   return (
//     <Card className="group relative overflow-hidden transition-all hover:scale-105">
//       <Link to={`/movie/${id}`}>
//         <CardHeader className="p-0">
//           <img
//             src={imageUrl}
//             alt={title}
//             className="aspect-[2/3] w-full object-cover"
//           />
//         </CardHeader>
//       </Link>
//       <div className="absolute right-2 top-2 flex gap-2">
//         <Button
//           size="icon"
//           variant="secondary"
//           className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
//           onClick={() => setShowReminder(true)}
//         >
//           <span className="sr-only">Set reminder</span>
//           🔔
//         </Button>
//         <Button
//           size="icon"
//           variant="secondary"
//           className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
//           onClick={onWatchlistToggle}
//         >
//           <Bookmark className={inWatchlist ? "fill-current" : ""} />
//           <span className="sr-only">
//             {inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
//           </span>
//         </Button>
//       </div>
//       <CardContent className="p-4">
//         <h3 className="font-semibold">{title}</h3>
//       </CardContent>
//       {showReminder && (
//         <WatchReminder
//           movieId={id}
//           movieTitle={title}
//           onClose={() => setShowReminder(false)}
//         />
//       )}
//     </Card>
//   );
// };
import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WatchReminder } from "./WatchReminder";

interface MovieCardProps {
  id: string;
  title: string;
  poster_path: string;
  inWatchlist: boolean;
  onWatchlistToggle: (id: string, inWatchlist: boolean) => void;
}

export const MovieCard = ({
  id,
  title,
  poster_path,
  inWatchlist,
  onWatchlistToggle,
}: MovieCardProps) => {
  const [showReminder, setShowReminder] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(inWatchlist);
  const navigate = useNavigate();
  const imageUrl = `https://image.tmdb.org/t/p/w154${poster_path}`;

  const handleMovieClick = () => {
    navigate(`/movie/${id}`); // Navigate to the movie details page
  };

  const handleWatchlistToggle = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent click from navigating
    const newStatus = !isInWatchlist; // Calculate new state

    // Optimistic UI update
    setIsInWatchlist(newStatus);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // Example logic for user ID

      const url = newStatus
        ? "https://movielist-nl59.onrender.com/api/v1/watchlist/add"
        : `https://movielist-nl59.onrender.com/api/v1/watchlist/remove/${id}`;

      const method = newStatus ? "POST" : "DELETE";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, movieId: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to update watchlist");
      }

      const data = await response.json();
      console.log("Watchlist updated:", data);

      // Notify parent about the change
      onWatchlistToggle(id, newStatus);
    } catch (error) {
      console.error("Error toggling watchlist:", error);

      // Rollback UI state on error
      setIsInWatchlist(!newStatus);
      alert("Failed to update watchlist. Please try again.");
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all hover:scale-105">
      <CardHeader className="p-0" onClick={handleMovieClick}>
        <img
          src={imageUrl}
          alt={title}
          className="aspect-[2/3] w-full object-cover"
        />
      </CardHeader>

      <div className="absolute right-2 top-2 flex gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8"
          onClick={() => setShowReminder(true)}
        >
          <span className="sr-only">Set reminder</span>
          🔔
        </Button>
        <Button
          size="icon"
          variant="secondary" // Keep this fixed to an accepted value
          className={`h-8 w-8 transition-colors ${isInWatchlist ? "bg-green-500 text-white" : "bg-gray-300 text-black"
            }`}
          onClick={handleWatchlistToggle}
        >
          <Bookmark className={isInWatchlist ? "fill-current" : ""} />
          <span className="sr-only">
            {isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          </span>
        </Button>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold">{title}</h3>
      </CardContent>

      {showReminder && (
        <WatchReminder
          movieId={id}
          movieTitle={title}
          onClose={() => setShowReminder(false)}
        />
      )}
    </Card>
  );
};
