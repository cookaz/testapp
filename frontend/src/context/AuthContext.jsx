import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api";
import { currentUser as placeholderUser } from "../data/placeholder";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load user from backend, fall back to placeholder
    const token = localStorage.getItem("pluscheck_token");
    if (token) {
      authAPI.getProfile()
        .then((data) => setUser(data.user))
        .catch(() => {
          // Use placeholder user for MVP
          setUser(placeholderUser);
        })
        .finally(() => setLoading(false));
    } else {
      // For MVP, auto-login with placeholder user
      setUser(placeholderUser);
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem("pluscheck_token", data.token);
    setUser(data.user);
    return data;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const data = await authAPI.signup(name, email, password);
    localStorage.setItem("pluscheck_token", data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("pluscheck_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}