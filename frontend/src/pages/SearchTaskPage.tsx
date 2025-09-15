import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SearchTaskPage() {
  const [taskId, setTaskId] = useState("");
  const [task, setTask] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTask(null);
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`);
      if (!response.ok) throw new Error("Task not found");
      const data = await response.json();
      setTask(data);
    } catch (err) {
      setError("Task not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="govuk-width-container">
      <main className="govuk-main-wrapper" id="main-content">
        <h1 className="govuk-heading-l">Search for a task by ID</h1>
        <form onSubmit={handleSearch}>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="taskId">
              Task ID
            </label>
            <input
              className="govuk-input"
              id="taskId"
              type="number"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              required
              min="1"
            />
          </div>
          <button type="submit" className="govuk-button">
            Search
          </button>
        </form>
        {loading && <p className="govuk-body">Loading...</p>}
        {error && <p className="govuk-error-message">{error}</p>}
        {task && (
          <div
            className="govuk-panel govuk-panel--confirmation"
            style={{ marginTop: "2em" }}
          >
            <h2 className="govuk-heading-m">Task found</h2>
            <p>
              <strong>ID:</strong> {task.id}
            </p>
            <p>
              <strong>Title:</strong> {task.title}
            </p>
            <p>
              <strong>Description:</strong> {task.description}
            </p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <p>
              <strong>Due date:</strong>{" "}
              {new Date(task.due_date).toLocaleString("en-GB")}
            </p>
            <Link
              to={`/tasks/${task.id}/edit`}
              className="govuk-link govuk-!-margin-right-3"
            >
              Edit
            </Link>
            <Link
              to={`/tasks/${task.id}/delete`}
              className="govuk-link govuk-link--destructive"
            >
              Delete
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
