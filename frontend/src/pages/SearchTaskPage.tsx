import React, { useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import ViewTaskPage from "./ViewTaskPage";

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
      <Breadcrumbs />
      <main className="govuk-main-wrapper" id="main-content">
        <h1 className="govuk-heading-l">Search for a task by ID</h1>

        {/* Search form */}
        <form onSubmit={handleSearch}>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="taskId">
              Task ID
            </label>
            <input
              className="govuk-input govuk-input--width-10"
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

        {/* Feedback */}
        {loading && <p className="govuk-body">Loading...</p>}
        {error && <p className="govuk-error-message">{error}</p>}

        {/* Reuse ViewTaskPage */}
        {task && <ViewTaskPage task={task} showBreadcrumbs={false} />}
      </main>
    </div>
  );
}
