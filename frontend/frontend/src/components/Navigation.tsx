import { Link, useLocation } from "react-router-dom";
import { Home, Search, Bookmark, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "./SearchBar";

export const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="mr-8 flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">MovieFlix</span>
        </Link>
        <div className="flex items-center space-x-6 text-sm font-medium">
          <Link
            to="/"
            className={cn(
              "flex items-center space-x-2 transition-colors hover:text-primary",
              isActive("/") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link
            to="/watchhistory"
            className={cn(
              "flex items-center space-x-2 transition-colors hover:text-primary",
              isActive("/watchlist") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Bookmark className="h-4 w-4" />
            <span>WatchHistory</span>
          </Link>

          <Link
            to="/reminders"
            className={cn(
              "flex items-center space-x-2 transition-colors hover:text-primary",
              isActive("/reminders") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Bookmark className="h-4 w-4" />
            <span>WatchReminders</span>
          </Link>

          <Link
            to="/mood"
            className={cn(
              "flex items-center space-x-2 transition-colors hover:text-primary",
              isActive("/mood") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Bookmark className="h-4 w-4" />
            <span>MoodSelector</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <SearchBar
            onSearch={() => { }}
            searchHistory={[]}
            onDeleteHistory={() => { }}
            onClearHistory={() => { }}
          />
          <Link
            to="/profile"
            className={cn(
              "flex items-center space-x-2 transition-colors hover:text-primary",
              isActive("/profile") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}