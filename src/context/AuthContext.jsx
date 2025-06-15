// src/context/AuthContext.js

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // On component mount, check if token exists
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      setToken(storedToken);

      // Attach token to axiosInstance for future requests
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${storedToken}`;

      // Optionally, verify the token or fetch user details
      // axiosInstance
      //   .get("/auth/profile")
      //   .then((res) => {
      //     setUser(res.data.user); // Assuming your API returns { user: {...} }
      //   })
      //   .catch((err) => {
      //     console.error("Token validation failed:", err);
      //     localStorage.removeItem("authToken");
      //     setToken(null);
      //     setUser(null);
      //     delete axiosInstance.defaults.headers.common["Authorization"];
      //   });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      setUser({ email }); // Or use res.data.user if available
      setToken(token);
      localStorage.setItem("authToken", token);

      // Set the default Authorization header on axiosInstance
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
  };

  const isAuthenticated = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
