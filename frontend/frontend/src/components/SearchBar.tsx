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
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
// import { useNavigate } from "react-router-dom";

// interface SearchBarProps {
//   searchHistory: { id: string; query: string; timestamp: string }[];
//   onSearch: (query: string) => void; // or some other function signature
//   onDeleteHistory: (id: string) => void; // or whatever matches the signature
//   onClearHistory: () => void;
// }

// export const SearchBar = ({ searchHistory, onSearch, onDeleteHistory, onClearHistory }) => {
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const [searchType, setSearchType] = useState("movie"); // Default to movie search
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const inputRef = useRef<HTMLInputElement>(null);

//   const searchEndpoints = {
//     movie: "/api/v1/search/movie/",
//     person: "/api/v1/search/person/",
//     tv: "/api/v1/search/tv/",
//   };

//   const handleSearch = async () => {
//     if (!query.trim()) {
//       setResults([]);
//       return;
//     }

//     setLoading(true);
//     setError("");




//     try {
//       const token = localStorage.getItem("token");
//       const endpoint = searchEndpoints[searchType];
//       const response = await fetch(`https://movielist-nl59.onrender.com${endpoint}${query}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Cache-Control": "no-cache, no-store, must-revalidate",
//         },
//         credentials: "include",
//       });

//       const data = await response.json();

//       if (data.success) {
//         setResults(data.content);
//       } else {
//         setResults([]);
//         setError("No results found.");
//       }
//     } catch (err) {
//       setError("Failed to fetch data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   useEffect(() => {
//     const toggleSearch = (e: KeyboardEvent) => {
//       if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault();
//         setOpen((prev) => !prev);
//       }
//     };

//     document.addEventListener("keydown", toggleSearch);
//     return () => document.removeEventListener("keydown", toggleSearch);
//   }, []);

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button variant="outline" className="w-[300px] justify-between text-muted-foreground">
//           <div className="flex items-center">
//             <Search className="mr-2 h-4 w-4" />
//             <span>Search movies, actors, or TV shows...</span>
//           </div>
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[300px] p-0" align="start">
//         <Command>
//           <CommandInput
//             ref={inputRef}
//             placeholder="Type to search..."
//             value={query}
//             onValueChange={setQuery}
//             onKeyDown={handleKeyPress}
//           />
//           <CommandList>
//             <CommandGroup>
//               <div className="flex space-x-4 px-4 py-2">
//                 <Button
//                   variant={searchType === "movie" ? "default" : "outline"}
//                   onClick={() => setSearchType("movie")}
//                 >
//                   Movies
//                 </Button>

//                 <Button
//                   variant={searchType === "person" ? "default" : "outline"}
//                   onClick={() => setSearchType("person")}
//                 >
//                   Actors
//                 </Button>
//                 <Button
//                   variant={searchType === "tv" ? "default" : "outline"}
//                   onClick={() => setSearchType("tv")}
//                 >
//                   TV Shows
//                 </Button>
//               </div>
//             </CommandGroup>
//             {loading && <CommandEmpty>Loading...</CommandEmpty>}
//             {error && <CommandEmpty>{error}</CommandEmpty>}
//             {results.length > 0 && (
//               <CommandGroup>
//                 {results.map((result) => (
//                   <CommandItem key={result.id}>
//                     <div className="flex items-center space-x-2">
//                       {result.image && (
//                         <img
//                           src={`https://image.tmdb.org/t/p/w92${result.image}`}
//                           alt={result.title}
//                           className="w-12 h-12 object-cover rounded"
//                         />
//                       )}
//                       <span>{result.title || result.name}</span>
//                     </div>
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             )}
//             {results.length === 0 && !loading && <CommandEmpty>No results found.</CommandEmpty>}
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
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  searchHistory: { id: string; query: string; timestamp: string }[];
  onSearch: (query: string) => void; // or some other function signature
  onDeleteHistory: (id: string) => void; // or whatever matches the signature
  onClearHistory: () => void;
}

export const SearchBar = ({ onSearch, onDeleteHistory, onClearHistory }: SearchBarProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("movie");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchHistory, setSearchHistory] = useState<
    { id: string; query: string; timestamp: string }[]
  >([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const searchEndpoints = {
    movie: "/api/v1/search/movie/",
    person: "/api/v1/search/person/",
    tv: "/api/v1/search/tv/",
  };

  // Load search history from local storage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save search history to local storage when updated
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const endpoint = searchEndpoints[searchType];
      const response = await fetch(`https://movielist-nl59.onrender.com${endpoint}${query}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.content);
        setSearchHistory((prev) => [
          ...prev,
          { id: Date.now().toString(), query, timestamp: new Date().toISOString() },
        ]);
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

  const handleResultClick = (id) => {
    if (searchType === "movie") {
      navigate(`/movie/${id}`);
    } else if (searchType === "person") {
      navigate(`/people/${id}`);
    } else if (searchType === "tv") {
      navigate(`/tvshows/${id}`);
    }
    setOpen(false); // Close the search bar on navigation
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updatedHistory = searchHistory.filter((item) => item.id !== id);
    setSearchHistory(updatedHistory);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };


  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (results.length > 0 || loading || error) {
      console.log("CommandList state updated");
    }
  }, [results, loading, error]);


  return (
    <Popover
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          setResults([]); // Reset results when reopening
          setError("");   // Clear any error messages
        }
      }}

    >
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
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
                  variant={searchType === "person" ? "default" : "outline"}
                  onClick={() => setSearchType("person")}
                >
                  Actors
                </Button>
                <Button
                  variant={searchType === "tv" ? "default" : "outline"}
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
                  <CommandItem key={result.id} onSelect={() => handleResultClick(result.id)}>
                    <div className="flex items-center space-x-2">
                      {result.image && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${result.image}`}
                          alt={result.title || result.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <span>{result.title || result.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {!loading && !results.length && (
              <CommandGroup>
                <div className="px-4 py-2">
                  <h4 className="mb-2">Search History</h4>
                  {searchHistory.length > 0 ? (
                    searchHistory.map((item) => (
                      <div key={item.id} className="flex justify-between items-center mb-2">
                        <span>{item.query}</span>
                        <Trash2
                          className="h-4 w-4 text-muted-foreground cursor-pointer"
                          onClick={() => handleDeleteHistoryItem(item.id)}
                        />
                      </div>
                    ))
                  ) : (
                    <span>No search history.</span>
                  )}
                  {searchHistory.length > 0 && (
                    <Button
                      variant="ghost"
                      className="mt-2"
                      onClick={handleClearHistory}
                    >
                      Clear All History
                    </Button>
                  )}
                </div>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
