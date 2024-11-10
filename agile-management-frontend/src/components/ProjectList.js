// src/components/ProjectList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import styled from "styled-components";

const StyledList = styled(List)`
  max-width: 600px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing(2)};
`;

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((response) => response.json())
      .then((data) => setProjects(data));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" color="textPrimary" gutterBottom>
        Projects
      </Typography>
      <StyledList component={Paper}>
        {projects.map((project) => (
          <ListItem key={project.id} component={Link} to={`/project/${project.id}`} button>
            <ListItemText primary={project.name} secondary={project.description} primaryTypographyProps={{ color: "textPrimary" }} />
          </ListItem>
        ))}
      </StyledList>
    </div>
  );
};

export default ProjectList;
