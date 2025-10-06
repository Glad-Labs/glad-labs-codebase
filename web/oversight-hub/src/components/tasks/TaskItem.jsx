import React from "react";
import { format } from "date-fns";

const TaskItem = ({ task }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Published":
        return "bg-green-600 text-green-100";
      case "In Progress":
        return "bg-yellow-600 text-yellow-100";
      case "Error":
        return "bg-red-600 text-red-100";
      case "New":
        return "bg-blue-600 text-blue-100";
      default:
        return "bg-gray-600 text-gray-100";
    }
  };

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
      <td className="p-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </td>
      <td className="p-3 font-medium text-gray-200">{task.topic}</td>
      <td className="p-3 text-gray-400">{task.category}</td>
      <td className="p-3 text-gray-400">
        {task.createdAt ? format(task.createdAt, "MMM dd, yyyy HH:mm") : "N/A"}
      </td>
      <td className="p-3">
        <button className="text-cyan-400 hover:text-cyan-300">View</button>
      </td>
    </tr>
  );
};

export default TaskItem;
