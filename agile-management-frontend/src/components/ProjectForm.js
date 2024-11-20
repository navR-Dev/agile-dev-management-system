import React, { useState } from "react";

const ProjectForm = ({ ownerId }) => {
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
        body: JSON.stringify({ name, description, owner: ownerId }),
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

  const containerStyle = {
    maxWidth: "400px",
    margin: "2rem auto",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.8rem",
    margin: "0.5rem 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.8rem",
    marginTop: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
  };

  const messageStyle = {
    marginTop: "1rem",
    padding: "0.5rem",
    color: message.startsWith("Error") ? "#ff4d4f" : "#4caf50",
    fontWeight: "bold",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#333" }}>Add New Project</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} placeholder="Project Name" onChange={(e) => setName(e.target.value)} style={inputStyle} required />
        <textarea value={description} placeholder="Project Description" onChange={(e) => setDescription(e.target.value)} rows="4" style={{ ...inputStyle, resize: "none" }} required />
        <button type="submit" style={buttonStyle}>
          Add Project
        </button>
      </form>
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
};

export default ProjectForm;
