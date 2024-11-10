// src/components/ProjectDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Paper, Button } from "@mui/material";
import styled from "styled-components";

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(3)};
  background-color: ${({ theme }) => theme.colors.background};
  max-width: 800px;
  margin: 2rem auto;
`;

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetch(`/api/project/${id}`)
      .then((response) => response.json())
      .then((data) => setProject(data));
  }, [id]);

  return (
    <StyledPaper>
      {project ? (
        <>
          <Typography variant="h4" color="textPrimary" gutterBottom>
            {project.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {project.description}
          </Typography>
          <Button variant="contained" color="primary" style={{ marginTop: "1rem" }}>
            Start Sprint
          </Button>
        </>
      ) : (
        <Typography>Loading project details...</Typography>
      )}
    </StyledPaper>
  );
};

export default ProjectDetails;
