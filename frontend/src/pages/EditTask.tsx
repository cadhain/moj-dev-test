import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const EditTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch task data on mount
  useEffect(() => {
    console.log("Fetching task with ID:", id);
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/tasks/${id}`);
        if (!response.ok) throw new Error("Failed to fetch task");
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description);
      } catch (err: any) {
        setError(err.message || "Error loading task");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) throw new Error("Failed to update task");
      navigate("/tasks");
    } catch (err: any) {
      setError(err.message || "Error updating task");
    }
  };

  if (loading) return <div className="govuk-width-container">Loading...</div>;
  if (error)
    return (
      <div className="govuk-width-container govuk-error-message">{error}</div>
    );

  return (
    <div className="govuk-width-container">
      <main className="govuk-main-wrapper" id="main-content">
        <h1 className="govuk-heading-l">Edit Task</h1>

        <form onSubmit={handleSubmit}>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="title">
              Task title
            </label>
            <input
              className="govuk-input"
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="description">
              Description
            </label>
            <textarea
              className="govuk-textarea"
              id="description"
              name="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="govuk-button">
            Save changes
          </button>

          <Link to="/tasks" className="govuk-link govuk-!-margin-left-3">
            Cancel
          </Link>
        </form>
      </main>
    </div>
  );
};

export default EditTaskPage;
