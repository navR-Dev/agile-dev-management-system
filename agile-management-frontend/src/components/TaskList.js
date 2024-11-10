import React from "react";

const TaskList = ({ tasks }) => (
  <div>
    <h2>Tasks</h2>
    {tasks.map((task) => (
      <div key={task.id}>
        <h3>{task.name}</h3>
        <p>{task.description}</p>
        <p>Status: {task.status}</p>
      </div>
    ))}
  </div>
);

export default TaskList;
