import React, { createContext, useState } from "react";
import { login as loginService, signup as signupService } from "../services/authService";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authTokens, setAuthTokens] = useState(() => JSON.parse(localStorage.getItem("authTokens")));

  const login = async (username, password) => {
    try {
      const response = await loginService(username, password);
      setAuthTokens(response.data);
      setUser(response.data.user);
      localStorage.setItem("authTokens", JSON.stringify(response.data));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthTokens(null);
    localStorage.removeItem("authTokens");
  };

  const signup = async (username, email, password) => {
    try {
      await signupService(username, email, password);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return <AuthContext.Provider value={{ user, login, logout, signup, authTokens }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
