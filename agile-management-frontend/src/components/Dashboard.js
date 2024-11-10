import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import styled from "styled-components";

const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.03);
  }
`;

const IssueCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 1rem;
  margin: 0.5rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Dashboard = () => {
  const [ongoingSprints, setOngoingSprints] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [newIssues, setNewIssues] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sprintResponse = await fetch("http://localhost:8000/api/ongoing_sprints/");
        const sprintData = await sprintResponse.json();
        if (sprintData.sprints) setOngoingSprints(sprintData.sprints);

        const taskResponse = await fetch("http://localhost:8000/api/recent_tasks/");
        const taskData = await taskResponse.json();
        if (taskData.tasks) setRecentTasks(taskData.tasks);

        const issueResponse = await fetch("http://localhost:8000/api/new_issues/");
        const issueData = await issueResponse.json();
        if (issueData.issues) setNewIssues(issueData.issues);
      } catch (error) {
        setMessage("Error fetching data");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" color="textPrimary" gutterBottom>
        Dashboard
      </Typography>

      {/* Top Half: Ongoing Sprints and Recent Tasks */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6">Ongoing Sprints</Typography>
              {ongoingSprints.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No ongoing sprints
                </Typography>
              ) : (
                ongoingSprints.map((sprint) => (
                  <Typography key={sprint.id} variant="body1">
                    <strong>{sprint.name}</strong>: {sprint.start_date} to {sprint.end_date}
                  </Typography>
                ))
              )}
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6">Recently Added Tasks</Typography>
              {recentTasks.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No recent tasks
                </Typography>
              ) : (
                recentTasks.map((task) => (
                  <Typography key={task.id} variant="body1">
                    <strong>{task.title}</strong>: {task.status}
                  </Typography>
                ))
              )}
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Bottom Half: Issue Board */}
      <div style={{ marginTop: "2rem" }}>
        <Typography variant="h6" color="textPrimary" gutterBottom>
          Issue Board
        </Typography>
        <Grid container spacing={2}>
          {newIssues.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              No new issues
            </Typography>
          ) : (
            newIssues.map((issue) => (
              <Grid item xs={12} sm={6} md={4} key={issue.id}>
                <IssueCard>
                  <Typography variant="body1">
                    <strong>Project:</strong> {issue.project}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Issue:</strong> {issue.title}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Assignee:</strong> {issue.assignee_name || "Unassigned"}
                  </Typography>
                </IssueCard>
              </Grid>
            ))
          )}
        </Grid>
      </div>
      {message && <Typography color="error">{message}</Typography>}
    </div>
  );
};

export default Dashboard;
