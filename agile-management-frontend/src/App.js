import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import ProjectList from "./components/ProjectList";
import ProjectDetails from "./components/ProjectDetails";
import ProjectForm from "./components/ProjectForm";
import TaskForm from "./components/TaskForm";
import SprintForm from "./components/SprintForm";
import IssueForm from "./components/IssueForm";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { AuthContext } from "./context/AuthContext"; // Import AuthContext
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";

function RequireAuth({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  // If not authenticated, redirect to login page
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const { isAuthenticated } = useContext(AuthContext); // To check if the user is logged in

  useEffect(() => {
    // Redirect user to Dashboard if they are already logged in
    if (isAuthenticated && window.location.pathname === "/login") {
      window.location.href = "/";
    }
  }, [isAuthenticated]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          {/* Only show the Navbar if the user is authenticated */}
          {isAuthenticated && <Navbar />}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/projects"
              element={
                <RequireAuth>
                  <ProjectList />
                </RequireAuth>
              }
            />
            <Route
              path="/project/:id"
              element={
                <RequireAuth>
                  <ProjectDetails />
                </RequireAuth>
              }
            />
            <Route
              path="/add-project"
              element={
                <RequireAuth>
                  <ProjectForm />
                </RequireAuth>
              }
            />
            <Route
              path="/add-task"
              element={
                <RequireAuth>
                  <TaskForm />
                </RequireAuth>
              }
            />
            <Route
              path="/add-issue"
              element={
                <RequireAuth>
                  <IssueForm />
                </RequireAuth>
              }
            />
            <Route
              path="/add-sprint"
              element={
                <RequireAuth>
                  <SprintForm />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
