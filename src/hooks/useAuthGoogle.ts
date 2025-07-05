import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "authUser";

export function useAuthGoogle() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // Solo parsea si es un JSON válido
    if (!stored || stored === "undefined") return null;
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  const login = useCallback((userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored || stored === "undefined") {
        setUser(null);
        return;
      }
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return { user, login, logout };
}