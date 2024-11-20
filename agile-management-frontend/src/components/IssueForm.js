import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, MenuItem } from "@mui/material";

const IssueForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("new");
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  // Fetch project list from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/get_projects/");
        const data = await response.json();
        if (data.projects) {
          setProjects(data.projects);
        }
      } catch (error) {
        setMessage("Error fetching projects");
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/add_issue/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, priority, status, project_id: selectedProject }),
      });
      const data = await response.json();
      setMessage(data.message);

      if (data.status === "success") {
        // Reset form fields
        setTitle("");
        setDescription("");
        setPriority("");
        setStatus("new");
        setSelectedProject("");
      }
    } catch (error) {
      setMessage("Error adding issue");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "500px",
        margin: "2rem auto",
        padding: "2rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
      }}>
      <Typography variant="h5" align="center" gutterBottom>
        Create New Issue
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required margin="normal" variant="outlined" />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth required multiline rows={4} margin="normal" variant="outlined" />
        <TextField label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)} select fullWidth margin="normal" variant="outlined">
          <MenuItem value="">Select Priority</MenuItem>
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </TextField>
        <TextField label="Status" value={status} onChange={(e) => setStatus(e.target.value)} select fullWidth margin="normal" variant="outlined">
          <MenuItem value="new">New</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
        </TextField>

        {/* Dropdown for Projects */}
        <TextField label="Project" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} select fullWidth required margin="normal" variant="outlined">
          <MenuItem value="">Select Project</MenuItem>
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{
            marginTop: "1rem",
            padding: "0.8rem",
            fontSize: "1rem",
          }}>
          Add Issue
        </Button>
      </form>
      {message && (
        <Typography
          variant="body1"
          align="center"
          sx={{
            marginTop: "1rem",
            color: message.startsWith("Error") ? "error.main" : "success.main",
            fontWeight: "bold",
          }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default IssueForm;
