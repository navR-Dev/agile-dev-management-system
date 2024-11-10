import React from "react";

const SprintList = ({ sprints }) => (
  <div>
    <h2>Sprints</h2>
    {sprints.map((sprint) => (
      <div key={sprint.id}>
        <h3>{sprint.name}</h3>
        <p>Start Date: {sprint.start_date}</p>
        <p>End Date: {sprint.end_date}</p>
      </div>
    ))}
  </div>
);

export default SprintList;
