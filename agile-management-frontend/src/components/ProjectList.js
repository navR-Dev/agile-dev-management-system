import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import styled from "styled-components";

const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  margin: ${({ theme }) => theme.spacing(2)};
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.03);
  }
`;

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/get_projects/");
        const data = await response.json();
        if (data.projects) {
          setProjects(data.projects);
        } else {
          setErrorMessage("Failed to load projects.");
        }
      } catch (error) {
        setErrorMessage("Error fetching projects.");
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  // Handle edit button click
  const handleEditClick = (project) => {
    setCurrentProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description);
    setOpenDialog(true);
  };

  // Handle delete button click
  const handleDeleteClick = async (projectId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (confirmDelete) {
      try {
        console.log("Deleting project with ID:", projectId);
        const response = await fetch(`http://localhost:8000/api/delete_project/${projectId}/`, {
          method: "DELETE",
        });

        if (response.ok) {
          setProjects(projects.filter((project) => project.id !== projectId));
        } else {
          const data = await response.json();
          setErrorMessage(data.error || "Failed to delete project.");
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        setErrorMessage("Error deleting project.");
      }
    }
  };

  // Handle save after editing project
  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/update_project/${currentProject.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
        }),
      });

      const data = await response.json();
      if (data.project) {
        setProjects(projects.map((project) => (project.id === currentProject.id ? { ...project, name: projectName, description: projectDescription } : project)));
        setOpenDialog(false);
      } else {
        setErrorMessage("Failed to update project.");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      setErrorMessage("Error updating project.");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" color="textPrimary" gutterBottom>
        Projects
      </Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      <Grid container spacing={4}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6">{project.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {project.description}
                </Typography>

                <Typography variant="subtitle1" color="textPrimary" style={{ marginTop: "1rem" }}>
                  Sprints:
                </Typography>
                {project.sprints && project.sprints.length > 0 ? (
                  project.sprints.map((sprint) => (
                    <div key={sprint.id}>
                      <Typography variant="body2">
                        <strong>{sprint.name}</strong>: {sprint.start_date} - {sprint.end_date}
                      </Typography>
                    </div>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No sprints available for this project.
                  </Typography>
                )}

                {/* Edit and Delete Buttons */}
                <div style={{ marginTop: "1rem" }}>
                  <Button variant="contained" color="primary" onClick={() => handleEditClick(project)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDeleteClick(project.id)} style={{ marginLeft: "1rem" }}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Editing Project */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <TextField label="Project Name" fullWidth variant="outlined" value={projectName} onChange={(e) => setProjectName(e.target.value)} style={{ marginBottom: "1rem" }} />
          <TextField label="Project Description" fullWidth variant="outlined" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectList;
