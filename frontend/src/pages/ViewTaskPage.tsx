import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";

const statusLabels: Record<string, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

export default function ViewTaskPage() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTask() {
      try {
        const response = await fetch(`http://localhost:8000/api/tasks/${id}`);
        if (!response.ok) throw new Error("Failed to fetch task");
        const data = await response.json();
        setTask(data);
      } catch (err) {
        setError("Could not load task details.");
      } finally {
        setLoading(false);
      }
    }
    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper" id="main-content">
          <p className="govuk-body">Loading...</p>
        </main>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="govuk-width-container">
        <Breadcrumbs />
        <main className="govuk-main-wrapper" id="main-content">
          <p className="govuk-error-message">{error || "Task not found."}</p>
        </main>
      </div>
    );
  }

  // Parse date/time for display
  const date = new Date(task.due_date);
  const dueDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const dueTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="govuk-width-container">
      <Breadcrumbs />
      <main className="govuk-main-wrapper" id="main-content">
        <h1 className="govuk-heading-l">View Task</h1>
        <form>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="title">
              Task title
            </label>
            <input
              className="govuk-input"
              id="title"
              name="title"
              type="text"
              value={task.title}
              disabled
              readOnly
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
              value={task.description || ""}
              disabled
              readOnly
            ></textarea>
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="status">
              Status
            </label>
            <input
              className="govuk-input"
              id="status"
              name="status"
              type="text"
              value={statusLabels[task.status] || task.status}
              disabled
              readOnly
            />
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="due_date">
              Due date
            </label>
            <input
              className="govuk-input"
              id="due_date"
              name="due_date"
              type="text"
              value={`${dueDate} at ${dueTime}`}
              disabled
              readOnly
            />
          </div>
          <Link to="/tasks" className="govuk-button govuk-button--secondary">
            Back to tasks
          </Link>
        </form>
      </main>
    </div>
  );
}
