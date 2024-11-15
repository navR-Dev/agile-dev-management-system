import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState(false);

  // Set CSRF token and authentication headers
  const setAuthHeaders = () => {
    const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]")?.content;
    if (csrfToken) {
      axios.defaults.headers["X-CSRFToken"] = csrfToken;
    }
    const token = localStorage.getItem("authToken"); // Example of fetching token
    if (token) {
      axios.defaults.headers["Authorization"] = `Bearer ${token}`;
    }
  };

  useEffect(() => {
    setAuthHeaders(); // Set headers when the component mounts
  }, []);

  const fetchSession = async () => {
    try {
      const sessionResponse = await axios.get("http://localhost:8000/api/session/");
      if (sessionResponse.status === 200) {
        const { user, auth_status } = sessionResponse.data;
        setUser(user);
        setAuthStatus(auth_status); // Set auth status based on the server response
      }
    } catch (error) {
      console.error("Session fetch error:", error);
      setUser(null);
      setAuthStatus(false); // Ensure authStatus is false if session fetch fails
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:8000/api/login/", { username, password });
      if (response.status === 200) {
        setUser({ username });
        setAuthStatus(true);
        fetchSession();
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const signup = async (name, organization, username, password, confirmPassword) => {
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    try {
      const response = await axios.post("http://localhost:8000/api/signup/", { name, organization, username, password, confirmPassword });
      if (response.status === 201) {
        setUser({ username });
        setAuthStatus(true); // Set auth status
        fetchSession();
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error("Signup failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:8000/api/logout/");
      setUser(null);
      setAuthStatus(false); // Set auth status to false
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return <AuthContext.Provider value={{ user, authStatus, login, signup, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
