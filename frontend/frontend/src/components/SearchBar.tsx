// import { useState, useEffect, useRef } from "react";
// import { Search, X, Clock, Trash2 } from "lucide-react";
// import { Button } from "./ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "./ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "./ui/popover";

// interface SearchHistory {
//   id: string;
//   query: string;
//   timestamp: string;
// }

// interface SearchBarProps {
//   onSearch: (query: string) => void;
//   searchHistory: SearchHistory[];
//   onDeleteHistory: (id: string) => void;
//   onClearHistory: () => void;
// }

// export const SearchBar = ({
//   onSearch,
//   searchHistory,
//   onDeleteHistory,
//   onClearHistory,
// }: SearchBarProps) => {
//   const [open, setOpen] = useState(false);
//   const [value, setValue] = useState(""); // Search query value
//   const inputRef = useRef<HTMLInputElement>(null);

//   const [movies, setMovies] = useState([]);  // State to store movie results
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Handle the search logic
//   const handleSearch = async (query: string) => {
//     setLoading(true);
//     setError("");
//     if (query.trim() === "") {
//       setMovies([]); // Clear the results if the query is empty
//       setLoading(false);
//       return;
//     }
//     try {
//       const response = await fetch(`https://movielist-nl59.onrender.com/api/v1/search/movie/${query}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         credentials: 'include'  // Ensures cookies are sent with the request
//       });
//       const data = await response.json();

//       if (data.success && data.content) {
//         setMovies(data.content); // Set the fetched movies to the state
//       } else {
//         setMovies([]); // Clear any previous results if no movies are found
//       }
//     } catch (err) {
//       setError("Failed to fetch movies"); // Show error message if fetch fails
//       setMovies([]); // Clear the movie list if there's an error
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       handleSearch(value); // Trigger the search when Enter is pressed
//     }
//   };

//   useEffect(() => {
//     // Function to toggle the search popover with `ctrl+k` or `cmd+k`
//     const down = (e: KeyboardEvent) => {
//       if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault();
//         setOpen((open) => !open);
//       }
//     };

//     document.addEventListener("keydown", down);
//     return () => document.removeEventListener("keydown", down);
//   }, []);

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           className="w-[300px] justify-between text-muted-foreground"
//         >
//           <div className="flex items-center">
//             <Search className="mr-2 h-4 w-4" />
//             <span>Search movies...</span>
//           </div>
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[300px] p-0" align="start">
//         <Command>
//           <CommandInput
//             ref={inputRef}
//             placeholder="Search movies..."
//             value={value}
//             onValueChange={(query) => setValue(query)} // Update value as user types
//             onKeyDown={handleKeyPress} // Trigger search on enter key press
//           />
//           <CommandList>
//             {loading && <CommandEmpty>Loading...</CommandEmpty>}
//             {error && <CommandEmpty>{error}</CommandEmpty>}
//             {movies.length > 0 ? (
//               movies.map((movie) => (
//                 <CommandItem
//                   key={movie.id}
//                   onSelect={() => handleSearch(movie.title)} // Trigger search when item is selected
//                 >
//                   <div className="flex items-center">
//                     <span>{movie.title}</span>
//                   </div>
//                 </CommandItem>
//               ))
//             ) : (
//               <CommandEmpty>No results found.</CommandEmpty>
//             )}
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// };


import { useState, useEffect, useRef } from "react";
import { Search, X, Clock, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface SearchBarProps {
  onSearchHistoryDelete: (id: string) => void;
  searchHistory: { id: string; query: string; timestamp: string }[];
}

export const SearchBar = ({ onSearchHistoryDelete, searchHistory }: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("movie"); // Default to movie search
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const searchEndpoints = {
    movie: "/api/v1/search/movie/",
    person: "/api/v1/search/person/",
    tv: "/api/v1/search/tv/",
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = searchEndpoints[searchType];
      const response = await fetch(`${endpoint}${query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.content);
      } else {
        setResults([]);
        setError("No results found.");
      }
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const toggleSearch = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", toggleSearch);
    return () => document.removeEventListener("keydown", toggleSearch);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[300px] justify-between text-muted-foreground">
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            <span>Search movies, actors, or TV shows...</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput
            ref={inputRef}
            placeholder="Type to search..."
            value={query}
            onValueChange={setQuery}
            onKeyDown={handleKeyPress}
          />
          <CommandList>
            <CommandGroup>
              <div className="flex space-x-4 px-4 py-2">
                <Button
                  variant={searchType === "movie" ? "default" : "outline"}
                  onClick={() => setSearchType("movie")}
                >
                  Movies
                </Button>

                <Button
                  variant={searchType === "person" ? "secondary" : "outline"}
                  onClick={() => setSearchType("person")}
                >
                  Actors
                </Button>
                <Button
                  variant={searchType === "tv" ? "secondary" : "outline"}
                  onClick={() => setSearchType("tv")}
                >
                  TV Shows
                </Button>
              </div>
            </CommandGroup>
            {loading && <CommandEmpty>Loading...</CommandEmpty>}
            {error && <CommandEmpty>{error}</CommandEmpty>}
            {results.length > 0 && (
              <CommandGroup>
                {results.map((result) => (
                  <CommandItem key={result.id}>
                    <div className="flex items-center space-x-2">
                      {result.image && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${result.image}`}
                          alt={result.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <span>{result.title || result.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {results.length === 0 && !loading && <CommandEmpty>No results found.</CommandEmpty>}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
