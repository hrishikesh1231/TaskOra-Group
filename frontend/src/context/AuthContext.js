

import {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import API from "../api";
import { CityContext } from "./CityContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { setCity } = useContext(CityContext);

  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  const justLoggedInRef = useRef(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (justLoggedInRef.current) {
        justLoggedInRef.current = false;
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/current-user");
        const loggedUser = res.data.user;

        setUserState(loggedUser);

        if (loggedUser?.district) {
          setCity(loggedUser.district);
        }
      } catch {
        setUserState(null);
        setCity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setCity]);

  // ✅ login
  const loginUser = (userData) => {
    justLoggedInRef.current = true;
    setUserState(userData);

    if (userData?.district) {
      setCity(userData.district);
    }
  };

  // ✅ refresh user from backend
  const refreshUser = async () => {
    try {
      const res = await API.get("/auth/current-user");
      const updatedUser = res.data.user;

      setUserState(updatedUser);

      if (updatedUser?.district) {
        setCity(updatedUser.district);
      }
    } catch (err) {
      console.error("❌ Failed to refresh user", err);
    }
  };

  // 🔥 FINAL FIX (IMPORTANT)
  const updateTokens = (newTokens) => {
    setUserState((prevUser) => {
      if (!prevUser) return prevUser;

      return {
        ...prevUser,
        tokens: newTokens, // ✅ new reference triggers re-render
      };
    });
  };

  // ✅ logout
  const logout = async () => {
    try {
      await API.get("/auth/logout");
    } catch {}

    setUserState(null);
    setCity(null);
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: loginUser,
        refreshUser,
        updateTokens,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};