'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/auth/me', {
          method: 'GET',
          credentials: 'include', // CRITICAL: This sends the cookie to the backend
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
        }
      } catch (err) {
        console.log("Not logged in");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    }
  }, []);

  // Use useEffect to sync the 'dark' class with the state
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <AppContext.Provider value={{ user, setUser, isDark, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) return { user: null, isDark: false, toggleTheme: () => {} };
  return context;
};