import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import { formatDateTime } from "../utils/date";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  due_date: string;
}

interface ViewTaskPageProps {
  task?: Task; // optional prop
  showBreadcrumbs?: boolean; // controls breadcrumbs display
}

const statusLabels: Record<string, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

export default function ViewTaskPage({
  task: taskProp,
  showBreadcrumbs = true,
}: ViewTaskPageProps) {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(taskProp || null);
  const [loading, setLoading] = useState(!taskProp); // only load if no prop
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no task prop provided, fetch from API using ID
    if (!task && id) {
      const fetchTask = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`http://localhost:8000/api/tasks/${id}`);
          if (!response.ok) throw new Error("Task not found");
          const data = await response.json();
          setTask(data);
        } catch (err) {
          setError("Task not found.");
        } finally {
          setLoading(false);
        }
      };

      fetchTask();
    }
  }, [id, task]);

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
        {showBreadcrumbs && <Breadcrumbs />}
        <main className="govuk-main-wrapper" id="main-content">
          <p className="govuk-error-message">{error || "Task not found."}</p>
        </main>
      </div>
    );
  }

  const formattedDue = formatDateTime(task.due_date);

  return (
    <div className="govuk-width-container">
      {showBreadcrumbs && <Breadcrumbs />}
      <main className="govuk-main-wrapper" id="main-content">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
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
                  value={formattedDue}
                  disabled
                  readOnly
                />
              </div>
              <Link
                to="/tasks"
                className="govuk-button govuk-button--secondary govuk-!-margin-right-3"
              >
                Back to tasks
              </Link>
              <Link
                to={`/tasks/${task.id}/edit`}
                className="govuk-button govuk-button--secondary govuk-!-margin-right-3"
              >
                Edit
              </Link>
              <Link
                to={`/tasks/${task.id}/delete`}
                className="govuk-button govuk-button--warning"
              >
                Delete
              </Link>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
