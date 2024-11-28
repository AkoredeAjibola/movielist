import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // const backendUrl = import.meta.env.VITE_BACKEND_URL;
    // console.log("Backend URL:", backendUrl);   // Update to use VITE_ prefix in Vite
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/authCheck", {
        method: "GET",
        credentials: "include", // Include cookies (if using JWT in cookies)
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate", // Disable caching
        },
      });

      const text = await response.text(); // Get the raw response as text
      //console.log("Response from authCheck:", text); // Log it to see what's returned

      if (!response.ok) {
        throw new Error("Auth check failed");
      }

      // If the response is JSON, parse it
      const data = JSON.parse(text);
      setUser(data);  // Assuming the user data is returned
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const userData = await response.json();
      setUser(userData);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, username: string) => {

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Signup failed");

      const userData = await response.json();
      setUser(userData);
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:3000/api/v1/auth/logout", { method: "POST" });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};