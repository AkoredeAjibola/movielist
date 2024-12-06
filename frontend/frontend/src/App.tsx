import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MoodRecommendations from "./pages/MoodRecommendations";
import { SearchBar } from "./components/SearchBar";
import WatchHistoryPage from "./pages/watchHistory";
import RemindersPage from "./pages/reminders";
import WatchlistPage from "./pages/WatchList";
import MovieDetails from "./pages/MovieDetails";
import ProfilePage from "./pages/profile";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/watchhistory" element={<WatchHistoryPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/reminders" element={<RemindersPage />} />

            <Route path="/movie/:id" element={<MovieDetails inWatchlist={false} onWatchlistToggle={function (): void {
              throw new Error("Function not implemented.");
            }} userId={""} onStatusUpdate={function (updatedWatchHistory): void {
              throw new Error("Function not implemented.");
            }} />} />



            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mood"
              element={
                <ProtectedRoute>
                  <MoodRecommendations />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;