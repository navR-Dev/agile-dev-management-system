import React, { useContext } from "react";
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
import Logout from "./components/Logout";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import { AuthContext } from "./context/AuthContext";

function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const { user } = useContext(AuthContext);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          {user && <Navbar />} {/* Show Navbar only if authenticated */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/logout" element={<Logout />} />

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
