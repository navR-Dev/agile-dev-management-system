import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";

const IssueForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/add_issue/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, priority }),
      });
      const data = await response.json();
      setMessage(data.message);

      if (data.status === "success") {
        setTitle("");
        setDescription("");
        setPriority("");
      }
    } catch (error) {
      setMessage("Error adding issue");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h6">Create New Issue</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required margin="normal" />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth required multiline rows={4} margin="normal" />
        <TextField label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)} fullWidth margin="normal" />
        <Button variant="contained" color="primary" type="submit">
          Add Issue
        </Button>
      </form>
      {message && <Typography variant="body1">{message}</Typography>}
    </div>
  );
};

export default IssueForm;
