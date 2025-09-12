import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const DeleteTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [taskTitle, setTaskTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTask() {
      try {
        const response = await fetch(`http://localhost:8000/api/tasks/${id}`);
        if (!response.ok) throw new Error("Failed to fetch task");
        const data = await response.json();
        setTaskTitle(data.title);
      } catch (err) {
        setError("Could not load task details.");
      } finally {
        setLoading(false);
      }
    }
    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    await fetch(`http://localhost:8000/api/tasks/${id}`, {
      method: "DELETE",
    });
    navigate("/tasks/deleted", { state: { taskTitle } });
  };

  if (loading) {
    return (
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper" id="main-content">
          <p className="govuk-body">Loading...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper" id="main-content">
          <p className="govuk-error-message">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="govuk-width-container">
      <main className="govuk-main-wrapper" id="main-content">
        <h1 className="govuk-heading-l">
          Are you sure you want to delete this task?
        </h1>

        <p className="govuk-body">
          <strong className="govuk-!-font-weight-bold">{taskTitle}</strong> will
          be permanently deleted.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDelete();
          }}
        >
          <button type="submit" className="govuk-button govuk-button--warning">
            Yes, delete task
          </button>
        </form>

        <p className="govuk-body">
          <Link to={`/tasks/${id}/edit`} className="govuk-link">
            No, go back to task
          </Link>
        </p>
      </main>
    </div>
  );
};

export default DeleteTaskPage;
