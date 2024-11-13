// src/components/ProjectList.js

import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
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
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProjectList;
