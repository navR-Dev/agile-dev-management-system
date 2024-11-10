import React, { useState, useEffect } from "react";

const SprintForm = () => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch the projects to be selected for the sprint
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/get_projects/"); // Adjust the endpoint if needed
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
        setProjectId(""); // Reset the selected project
      }
    } catch (error) {
      setMessage("Error adding sprint");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add New Sprint</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} placeholder="Sprint Name" onChange={(e) => setName(e.target.value)} required />
        <input type="date" value={startDate} placeholder="Start Date" onChange={(e) => setStartDate(e.target.value)} required />
        <input type="date" value={endDate} placeholder="End Date" onChange={(e) => setEndDate(e.target.value)} required />
        <select value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
          <option value="">Select a Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Sprint</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SprintForm;
