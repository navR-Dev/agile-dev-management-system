import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  color: white;
  margin: 0 1rem;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Navbar = () => (
  <AppBar position="sticky" style={{ backgroundColor: "#6200ea" }}>
    <Toolbar>
      <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
        Agile Management System
      </Typography>
      <StyledLink to="/">Dashboard</StyledLink>
      <StyledLink to="/projects">Projects</StyledLink>
      <StyledLink to="/add-project">Add Project</StyledLink>
      <StyledLink to="/add-task">Add Task</StyledLink>
      <StyledLink to="/add-sprint">Add Sprint</StyledLink> {/* Add link for Add Sprint */}
      <StyledLink to="/add-issue">Add Issue</StyledLink>
    </Toolbar>
  </AppBar>
);

export default Navbar;
