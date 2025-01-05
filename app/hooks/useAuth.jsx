// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { u } from "../util/url";
import { emitter } from "../util/mitt";

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [registered, setRegistered] = useState(true);

  const getToken = () => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      url.searchParams.delete("token");
      window.history.replaceState({}, document.title, url);
    }
  };

  const login = async ({ email, password }) => {
    setMutationLoading(true);
    setError(null);
    console.log("login", { email, password });
    const r = await fetch(u("/api/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (r.ok) {
      const { token } = await r.json();
      localStorage.setItem("token", token);
      setUser(null);
      fetchUser();
      emitter.emit("login");
      setMutationLoading(false);
    } else {
      const { message } = await r.json();
      setError(message);
      setMutationLoading(false);
    }
    setMutationLoading(false);
  };

  const register = async ({ name, email, password }) => {
    setMutationLoading(true);
    setError(null);
    console.log("register", { name, email, password });
    const r = await fetch(u("/api/auth/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (r.ok) {
      setRegistered(true);
    } else {
      const { message } = await r.json();
      setError(message);
      setMutationLoading(false);
    }
    setMutationLoading(false);
  };

  const fetchUser = async () => {
    getToken();

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setLoggedIn(false);
      setUser(null);
      return;
    }

    const r = await fetch(u("/api/auth/me"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (r.ok) {
      const { user } = await r.json();
      setUser(user);
      setLoggedIn(true);
      setLoading(false);
    }

    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setLoggedIn(false);
  };

  useEffect(() => {
    window.fetchUser = fetchUser;
    fetchUser();
  }, []);

  useEffect(() => {
    window.logout = logout;
    emitter.on("logout", () => {
      logout();
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        loggedIn,
        error,
        mutationLoading,
        register,
        registered,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
