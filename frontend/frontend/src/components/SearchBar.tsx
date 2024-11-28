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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface SearchHistory {
  id: string;
  query: string;
  timestamp: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  searchHistory: SearchHistory[];
  onDeleteHistory: (id: string) => void;
  onClearHistory: () => void;
}

export const SearchBar = ({
  onSearch,
  searchHistory,
  onDeleteHistory,
  onClearHistory,
}: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(""); // Search query value
  const inputRef = useRef<HTMLInputElement>(null);

  const [movies, setMovies] = useState([]);  // State to store movie results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle the search logic
  const handleSearch = async (query: string) => {
    setLoading(true);
    setError("");
    if (query.trim() === "") {
      setMovies([]); // Clear the results if the query is empty
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/v1/search/movie/${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'  // Ensures cookies are sent with the request
      });
      const data = await response.json();

      if (data.success && data.content) {
        setMovies(data.content); // Set the fetched movies to the state
      } else {
        setMovies([]); // Clear any previous results if no movies are found
      }
    } catch (err) {
      setError("Failed to fetch movies"); // Show error message if fetch fails
      setMovies([]); // Clear the movie list if there's an error
    } finally {
      setLoading(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(value); // Trigger the search when Enter is pressed
    }
  };

  useEffect(() => {
    // Function to toggle the search popover with `ctrl+k` or `cmd+k`
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[300px] justify-between text-muted-foreground"
        >
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            <span>Search movies...</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput
            ref={inputRef}
            placeholder="Search movies..."
            value={value}
            onValueChange={(query) => setValue(query)} // Update value as user types
            onKeyDown={handleKeyPress} // Trigger search on enter key press
          />
          <CommandList>
            {loading && <CommandEmpty>Loading...</CommandEmpty>}
            {error && <CommandEmpty>{error}</CommandEmpty>}
            {movies.length > 0 ? (
              movies.map((movie) => (
                <CommandItem
                  key={movie.id}
                  onSelect={() => handleSearch(movie.title)} // Trigger search when item is selected
                >
                  <div className="flex items-center">
                    <span>{movie.title}</span>
                  </div>
                </CommandItem>
              ))
            ) : (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};