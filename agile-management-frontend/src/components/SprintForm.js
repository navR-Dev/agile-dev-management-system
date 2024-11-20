import React, { useState, useEffect } from "react";

const SprintForm = () => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/get_projects/");
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setMessage("Error fetching projects");
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/add_sprint/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          start_date: startDate,
          end_date: endDate,
          project_id: projectId,
        }),
      });
      const data = await response.json();
      setMessage(data.status === "success" ? "Sprint added successfully!" : data.message);
      if (data.status === "success") {
        setName("");
        setStartDate("");
        setEndDate("");
        setProjectId("");
      }
    } catch (error) {
      setMessage("Error adding sprint");
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
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#333" }}>Add New Sprint</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} placeholder="Sprint Name" onChange={(e) => setName(e.target.value)} style={inputStyle} required />
        <input type="date" value={startDate} placeholder="Start Date" onChange={(e) => setStartDate(e.target.value)} style={inputStyle} required />
        <input type="date" value={endDate} placeholder="End Date" onChange={(e) => setEndDate(e.target.value)} style={inputStyle} required />
        <select value={projectId} onChange={(e) => setProjectId(e.target.value)} style={inputStyle} required>
          <option value="">Select a Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <button type="submit" style={buttonStyle}>
          Add Sprint
        </button>
      </form>
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
};

export default SprintForm;
