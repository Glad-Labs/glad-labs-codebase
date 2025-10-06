import React, { useState } from "react";
import { createTask } from "../../services/taskService";

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [topic, setTopic] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic || !primaryKeyword || !targetAudience || !category) {
      setError("All fields are required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const newTask = {
        topic,
        primary_keyword: primaryKeyword,
        target_audience: targetAudience,
        category,
      };
      await createTask(newTask);
      onTaskCreated();
      // Reset form for next use
      setTopic("");
      setPrimaryKeyword("");
      setTargetAudience("");
      setCategory("");
    } catch (err) {
      setError("Failed to create task. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
          Create New Content Task
        </h2>
        {error && (
          <p className="text-red-500 bg-red-100 border border-red-400 p-3 rounded-md mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="topic" className="block text-gray-300 mb-2">
              Topic
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="primaryKeyword"
              className="block text-gray-300 mb-2"
            >
              Primary Keyword
            </label>
            <input
              id="primaryKeyword"
              type="text"
              value={primaryKeyword}
              onChange={(e) => setPrimaryKeyword(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="targetAudience"
              className="block text-gray-300 mb-2"
            >
              Target Audience
            </label>
            <input
              id="targetAudience"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-300 mb-2">
              Category
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="py-2 px-6 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-2 px-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition duration-300 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
