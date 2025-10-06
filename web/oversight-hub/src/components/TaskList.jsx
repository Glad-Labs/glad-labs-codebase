import React from "react";
import { formatTimestamp, renderStatus } from "../utils/helpers";
import "./TaskList.css";

const TaskList = ({ tasks, onTaskClick }) => (
  <div className="task-list">
    <table>
      <thead>
        <tr>
          <th>Topic</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Primary Keyword</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} onClick={() => onTaskClick(task)}>
            <td>{task.topic}</td>
            <td>{renderStatus(task.status)}</td>
            <td>{formatTimestamp(task.createdAt)}</td>
            <td>{task.primary_keyword}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TaskList;
