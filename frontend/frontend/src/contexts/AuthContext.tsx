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
    const backendUrl = "https://movielist-nl59.onrender.com";

    try {
      const response = await fetch(`${backendUrl}/api/v1/auth/authCheck`, {
        method: "GET",
        credentials: "include", // Include cookies
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate", // Disable caching
        },
      });

      const text = await response.text();
      console.log("Response from authCheck:", text); // Log the raw response

      if (!response.ok) {
        throw new Error("Auth check failed");
      }

      try {
        const data = JSON.parse(text); // Parse response as JSON
        setUser(data); // Assuming the user data is returned
      } catch (error) {
        console.error("Failed to parse JSON:", error, "Raw text:", text);
        throw new Error("Invalid JSON response from server");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const login = async (email: string, password: string) => {
    const backendUrl = "https://movielist-nl59.onrender.com"
    try {
      const response = await fetch(`${backendUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensure cookies are sent with the request
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login response:", data);

      // Save token in localStorage (if needed for frontend use)
      localStorage.setItem("token", data.token);
      console.log("Token saved successfully");
      // Update frontend state
      setUser(data.user);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };




  const signup = async (email: string, password: string, username: string) => {
    const backendUrl = "https://movielist-nl59.onrender.com";
    try {
      const response = await fetch(`${backendUrl}/api/v1/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Signup failed");

      const userData = await response.json();
      setUser(userData);
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    const backendUrl = "https://movielist-nl59.onrender.com";
    try {
      await fetch(`${backendUrl}/api/v1/auth/logout`, { method: "POST" });
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