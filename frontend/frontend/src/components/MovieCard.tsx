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
    console.log("Button clicked");
    try {
      const newStatus = !isInWatchlist; // Determine the new status
      await addToWatchlist(id, newStatus); // Call API to update watchlist
      setIsInWatchlist(newStatus); // Update local UI state
      onWatchlistToggle(id, newStatus); // Call parent function to sync state
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    }
  };

  const addToWatchlist = async (movieId: string, newStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const url = newStatus
        ? "https://movielist-nl59.onrender.com/api/v1/watchlist/add"
        : `https://movielist-nl59.onrender.com/api/v1/watchlist/remove/${id}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: "USER_ID", movieId }), // Replace with actual userId logic
      });

      if (!response.ok) {
        throw new Error("Failed to update watchlist");
      }

      const data = await response.json();
      console.log("Watchlist updated:", data);
      return data; // Return data for any additional processing
    } catch (error) {
      console.error("Error updating watchlist:", error);
      throw error;
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
          variant="secondary"
          className="h-8 w-8"
          onClick={handleWatchlistToggle} // Toggle watchlist state on click
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
