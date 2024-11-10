// src/components/ProjectForm.js
import React, { useState } from "react";

const ProjectForm = ({ ownerId }) => {
  // Assuming ownerId is passed as a prop
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/add_project/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, owner: ownerId }), // Include owner ID in the request
      });
      const data = await response.json();
      setMessage(data.status === "success" ? "Project added successfully!" : data.message);
      if (data.status === "success") {
        setName("");
        setDescription("");
      }
    } catch (error) {
      setMessage("Error adding project");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} placeholder="Project Name" onChange={(e) => setName(e.target.value)} required />
        <textarea value={description} placeholder="Project Description" onChange={(e) => setDescription(e.target.value)} required />
        <button type="submit">Add Project</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProjectForm;
