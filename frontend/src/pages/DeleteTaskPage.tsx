import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const DeleteTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Placeholder task title (we’ll fetch from API later)
  const taskTitle = "Example task title";

  const handleDelete = () => {
    // TODO: Replace with API call to delete task
    console.log(`Deleted task with ID: ${id}`);
    navigate("/tasks");
  };

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
            console.log("Task deleted");
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
