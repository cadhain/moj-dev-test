import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: "To do" | "In progress" | "Done";
  due_date: string;
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("http://localhost:8000/api/tasks");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  return (
    <div className="govuk-width-container">
      <h1 className="govuk-heading-l">Your tasks</h1>

      {loading ? (
        <p className="govuk-body">Loading...</p>
      ) : error ? (
        <div
          className="govuk-error-summary"
          aria-labelledby="error-summary-title"
          role="alert"
          tabIndex={-1}
        >
          <h2 className="govuk-error-summary__title" id="error-summary-title">
            There was a problem
          </h2>
          <div className="govuk-error-summary__body">
            <p className="govuk-body">{error}</p>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <p className="govuk-body">No tasks available.</p>
      ) : (
        <table className="govuk-table">
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th className="govuk-table__header">Title</th>
              <th className="govuk-table__header">Status</th>
              <th className="govuk-table__header">Due date</th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {tasks.map((task) => (
              <tr className="govuk-table__row" key={task.id}>
                <td className="govuk-table__cell">{task.title}</td>
                <td className="govuk-table__cell">{task.status}</td>
                <td className="govuk-table__cell">
                  {new Date(task.due_date).toLocaleString("en-GB", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}{" "}
                  <Link to={`/tasks/${task.id}/edit`} className="govuk-link">
                    Edit
                  </Link>{" "}
                  <Link
                    to={`/tasks/${task.id}/delete`}
                    className="govuk-button govuk-button--warning"
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/tasks/new" className="govuk-button govuk-button--secondary">
        Create new task
      </Link>
    </div>
  );
}
