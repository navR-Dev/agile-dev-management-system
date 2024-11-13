import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import ProjectList from "./components/ProjectList";
import ProjectDetails from "./components/ProjectDetails";
import ProjectForm from "./components/ProjectForm";
import TaskForm from "./components/TaskForm";
import SprintForm from "./components/SprintForm";
import IssueForm from "./components/IssueForm"; // Import IssueForm
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/add-project" element={<ProjectForm />} />
            <Route path="/add-task" element={<TaskForm />} />
            <Route path="/add-issue" element={<IssueForm />} /> {/* Add IssueForm route */}
            <Route path="/add-sprint" element={<SprintForm />} />
            <Route path="/projects" element={<ProjectList />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
