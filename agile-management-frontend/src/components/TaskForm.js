import React, { useState, useEffect } from "react";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sprintId, setSprintId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [status, setStatus] = useState("TO_DO");
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]); // State to hold sprints for the selected project
  const [message, setMessage] = useState("");
  const [projectId, setProjectId] = useState(""); // New state for project_id

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/get_projects/");
        const data = await response.json();
        if (data.projects) {
          setProjects(data.projects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setMessage("Error fetching projects");
      }
    };

    fetchProjects();
  }, []);

  // Fetch sprints whenever the selected project changes
  useEffect(() => {
    const fetchSprints = async () => {
      if (projectId) {
        try {
          const response = await fetch(`http://localhost:8000/api/get_sprints/${projectId}/`); // API endpoint to get sprints for the selected project
          const data = await response.json();
          if (data.sprints) {
            setSprints(data.sprints);
          }
        } catch (error) {
          console.error("Error fetching sprints:", error);
          setMessage("Error fetching sprints");
        }
      }
    };

    fetchSprints();
  }, [projectId]); // Runs when projectId changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/add_task/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          sprint_id: sprintId,
          assignee_id: assigneeId,
          status,
          project_id: projectId, // Include project_id in the task creation request
        }),
      });
      const data = await response.json();
      setMessage(data.status === "success" ? "Task added successfully!" : data.message);
      if (data.status === "success") {
        setTitle("");
        setDescription("");
        setSprintId("");
        setAssigneeId("");
        setStatus("TO_DO");
        setProjectId(""); // Reset the project_id after successful task addition
      }
    } catch (error) {
      setMessage("Error adding task");
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
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#333" }}>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={title} placeholder="Task Title" onChange={(e) => setTitle(e.target.value)} style={inputStyle} required />
        <textarea value={description} placeholder="Task Description" onChange={(e) => setDescription(e.target.value)} rows="4" style={{ ...inputStyle, resize: "none" }} required />

        {/* Project selection */}
        <select value={projectId} onChange={(e) => setProjectId(e.target.value)} style={inputStyle} required>
          <option value="">Select a Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        {/* Sprint selection - filtered by selected project */}
        <select value={sprintId} onChange={(e) => setSprintId(e.target.value)} style={inputStyle} required disabled={!projectId}>
          <option value="">Select a Sprint</option>
          {sprints.map((sprint) => (
            <option key={sprint.id} value={sprint.id}>
              {sprint.name}
            </option>
          ))}
        </select>

        {/* Assignee selection */}
        <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} style={inputStyle}>
          <option value="">Select Assignee</option>
          {/* Populate with assignee options dynamically */}
        </select>

        {/* Status selection */}
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
          <option value="TO_DO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>

        <button type="submit" style={buttonStyle}>
          Add Task
        </button>
      </form>
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
};

export default TaskForm;
