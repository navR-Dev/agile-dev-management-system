import React, { useState, useEffect } from "react";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sprintId, setSprintId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [status, setStatus] = useState("TO_DO");
  const [projects, setProjects] = useState([]); // Assuming you have projects related to sprints
  const [message, setMessage] = useState("");

  // Fetch the sprints (or projects related to sprints) when the component mounts
  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/get_sprints/"); // Adjust the endpoint if needed
        const data = await response.json();
        if (data.sprints) {
          setProjects(data.sprints); // Assuming projects are related to sprints in your case
        }
      } catch (error) {
        console.error("Error fetching sprints:", error);
        setMessage("Error fetching sprints");
      }
    };

    fetchSprints();
  }, []);

  // Handle form submission
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
        }),
      });
      const data = await response.json();
      setMessage(data.status === "success" ? "Task added successfully!" : data.message);
      if (data.status === "success") {
        setTitle("");
        setDescription("");
        setSprintId(""); // Reset sprint selection
        setAssigneeId(""); // Reset assignee selection
        setStatus("TO_DO"); // Reset status
      }
    } catch (error) {
      setMessage("Error adding task");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={title} placeholder="Task Title" onChange={(e) => setTitle(e.target.value)} required />
        <textarea value={description} placeholder="Task Description" onChange={(e) => setDescription(e.target.value)} required />
        <select value={sprintId} onChange={(e) => setSprintId(e.target.value)} required>
          <option value="">Select a Sprint</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name} {/* Assuming project name for sprints */}
            </option>
          ))}
        </select>
        <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
          <option value="">Select Assignee</option>
          {/* Assumes you have a list of users to assign */}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="TO_DO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <button type="submit">Add Task</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TaskForm;
