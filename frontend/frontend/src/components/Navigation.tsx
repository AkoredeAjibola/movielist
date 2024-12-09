import { Link, useLocation } from "react-router-dom";
import { Home, Bookmark, User, Menu, X, Clock, Bell, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "./SearchBar";
import { useState } from "react";

export const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">MovieFlix</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
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
              isActive("/watchhistory") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Clock className="h-4 w-4" />
            <span>Watch History</span>
          </Link>
          <Link
            to="/watchlist"
            className={cn(
              "flex items-center space-x-2 transition-colors hover:text-primary",
              isActive("/watchlist") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Bookmark className="h-4 w-4" />
            <span>Watch List</span>
          </Link>
          <Link
            to="/reminders"
            className={cn(
              "flex items-center space-x-2 transition-colors hover:text-primary",
              isActive("/reminders") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Bell className="h-4 w-4" />
            <span>Reminders</span>
          </Link>
          <Link
            to="/mood"
            className={cn(
              "flex items-center space-x-2 transition-colors hover:text-primary",
              isActive("/mood") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Smile className="h-4 w-4" />
            <span>Mood Selector</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-muted-foreground transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Search Bar and Profile (Desktop Only) */}
        <div className="hidden md:flex items-center space-x-4">
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background w-full">
          <div className="flex flex-col items-start space-y-4 p-4">
            <Link
              to="/"
              className={cn(
                "flex items-center space-x-2 transition-colors hover:text-primary",
                isActive("/") ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/watchhistory"
              className={cn(
                "flex items-center space-x-2 transition-colors hover:text-primary",
                isActive("/watchhistory") ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Clock className="h-4 w-4" />
              <span>Watch History</span>
            </Link>

            <Link
              to="/watchlist"
              className={cn(
                "flex items-center space-x-2 transition-colors hover:text-primary",
                isActive("/watchhistory") ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Bookmark className="h-4 w-4" />
              <span>Watch List</span>
            </Link>



            <Link
              to="/reminders"
              className={cn(
                "flex items-center space-x-2 transition-colors hover:text-primary",
                isActive("/reminders") ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Bell className="h-4 w-4" />
              <span>Reminders</span>
            </Link>
            <Link
              to="/mood"
              className={cn(
                "flex items-center space-x-2 transition-colors hover:text-primary",
                isActive("/mood") ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Smile className="h-4 w-4" />
              <span>Mood Selector</span>
            </Link>
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
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
