// import { useState } from "react";
// import { HeroSection } from "@/components/HeroSection";
// import { MovieCard } from "@/components/MovieCard";
// import { Navigation } from "@/components/Navigation";

// const Index = () => {
//   const [inWatchlist, setInWatchlist] = useState(false);

//   // Mock data - replace with actual API calls
//   const featuredMovie = {
//     id: "1",
//     title: "Inception",
//     overview:
//       "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
//     backdropPath: "/8ZTVqHMKqRvkz4SBGcnefa0P0Zq.jpg",
//     genres: ["Action", "Sci-Fi", "Thriller"],
//   };

//   const trendingMovies = [
//     {
//       id: "1",
//       title: "Inception",
//       posterPath: "/8ZTVqHMKqRvkz4SBGcnefa0P0Zq.jpg",
//     },
//     // Add more movies
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       <Navigation />
//       <main className="pt-16">
//         <HeroSection
//           movie={featuredMovie}
//           inWatchlist={inWatchlist}
//           onWatchlistToggle={() => setInWatchlist(!inWatchlist)}
//         />
//         <section className="container py-8">
//           <h2 className="text-2xl font-semibold mb-4">Trending Now</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//             {trendingMovies.map((movie) => (
//               <MovieCard
//                 key={movie.id}
//                 id={movie.id}
//                 title={movie.title}
//                 posterPath={movie.posterPath}
//                 inWatchlist={false}
//                 onWatchlistToggle={() => {}}
//               />
//             ))}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Index;


import React, { useEffect, useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { MovieCard } from "@/components/MovieCard";
import { Navigation } from "@/components/Navigation";
import { Movie } from "@/components/HeroSection";

const BASE_URL = "https://movielist-nl59.onrender.com"



const Index: React.FC = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null); // Featured movie
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]); // Trending movies
  const [moviecategory, setMovieCategory] = useState<Movie[]>([]); // Trending movies
  const [searchResults, setSearchResults] = useState<Movie[]>([]); // Search results
  const [view, setView] = useState<"default" | "search">("default");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [inWatchlist, setInWatchlist] = useState(false);

  // Fetch movies from backend
  const fetchMovies = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<Movie[]>>
  ): Promise<void> => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from local storage (if applicable)

      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        credentials: "include", // Include cookies in the request
        headers: {
          // If you're using JWT, attach it to the Authorization header
          "Authorization": token ? `Bearer ${token}` : "", // Add Bearer token to the Authorization header if token exists
          "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching
        },
      });
      const data = await response.json();
      console.log("Trending Movies API response:", data);  // Log the response


      if (data.success && Array.isArray(data.content?.results)) {
        setter(data.content?.results); // Set the movie in the trendingMovies array as a single-item array
      } else {
        throw new Error("Failed to fetch movies.");
      }
    } catch (err) {
      setError((err as Error).message || "Something went wrong");
    }
  };

  // Fetch featured movie using trending movies as source
  const fetchFeaturedMovie = async () => {
    try {
      const response = await fetch("https://movielist-nl59.onrender.com/api/v1/movie/trending", {
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching
        },
      });
      const data = await response.json();

      console.log("API response:", data); // Log to check the structure

      // Check if results exists and has at least one item
      if (data.success && data.content) {
        const movie = data.content;
        // Check if movie has necessary properties
        if (movie.title && movie.backdrop_path) {
          setFeaturedMovie({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            backdropPath: movie.backdrop_path, // Correctly map the property name
            poster_path: movie.poster_path, // Correctly map the property name
            genres: [], // You can update this if you have genre data or handle it differently
          });
        } else {
          throw new Error("Movie data is missing required properties.");
        }
      } else {
        throw new Error("No movie content found.");
      }
    } catch (err) {
      console.error("Error in fetchFeaturedMovie:", err);
      setError((err as Error).message || "Failed to fetch featured movie");
    }
  };




  // Handle search functionality
  const handleSearch = async (query: string) => {
    setView("search");
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/search?query=${query}&page=1`);
      const data = await response.json();
      if (data.error) throw new Error(data.message);
      setSearchResults(data.results || []);
    } catch (err) {
      setError((err as Error).message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "default") {
      setLoading(true);
      Promise.all([
        fetchFeaturedMovie(),
        fetchMovies("api/v1/movie/popular", setTrendingMovies), // Fetch trending movies
      ]).finally(() => setLoading(false));
    }
  }, [view]);






  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Featured Movie */}
        {featuredMovie ? (
          <HeroSection
            movie={featuredMovie}
            inWatchlist={inWatchlist}
            onWatchlistToggle={() => setInWatchlist(!inWatchlist)}
          />
        ) : (
          <p className="text-center text-neutral-200">Loading featured movie...</p>
        )}

        {/* Trending Section */}
        <section className="container py-8">
          <h2 className="text-2xl font-semibold mb-4">Trending Now</h2>
          {loading ? (
            <p className="text-center text-neutral-200">Loading trending movies...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.isArray(trendingMovies) && trendingMovies.length > 0 ? (
                trendingMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    poster_path={movie.poster_path}
                    inWatchlist={false}
                    onWatchlistToggle={() => { }}
                  />
                ))
              ) : (
                <p>No trending movies available</p>  // Fallback message if the data is not an array or empty
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
export default Index;

