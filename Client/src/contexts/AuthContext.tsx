import React, { createContext, useContext, useEffect, useState } from "react";
import * as AuthService from "../services/apiService";
import { User } from "../types";

// -----------------------------
// TYPES
// -----------------------------
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// -----------------------------
// CONTEXT
// -----------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -----------------------------
// PROVIDER
// -----------------------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // INIT AUTH (ON APP LOAD)
  // -----------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    // If no token → skip API call
    if (!token) {
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        const data = await AuthService.getMeApi();
        setUser(data);
      } catch (error) {
        console.error("Auth restore failed");
        localStorage.removeItem("token"); // cleanup invalid token
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // -----------------------------
  // LOGIN
  // -----------------------------
  const login = async (credentials: { email: string; password: string }) => {
    try {
      const data = await AuthService.loginApi(credentials);

      // Save token
      localStorage.setItem("token", data.token);

      // Set user
      setUser(data.user);
    } catch (error: any) {
      console.error("Login failed:", error?.message);
      throw error;
    }
  };

  // -----------------------------
  // REGISTER
  // -----------------------------
  const register = async (payload: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const data = await AuthService.registerApi(payload);

      // Save token
      localStorage.setItem("token", data.token);

      // Set user
      setUser(data.user);
    } catch (error: any) {
      console.error("Register failed:", error?.message);
      throw error;
    }
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = async () => {
    try {
      await AuthService.logoutApi();
    } catch (error) {
      console.warn("Logout API failed (continuing)");
    } finally {
      localStorage.removeItem("token"); // remove token
      setUser(null);
    }
  };

  // -----------------------------
  // VALUE
  // -----------------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// -----------------------------
// HOOK
// -----------------------------
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};