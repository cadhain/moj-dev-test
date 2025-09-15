import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TaskTable from "../components/TaskTable";
import ErrorSummary from "../components/ErrorSummary";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  due_date: string;
};

export default function TaskListPage() {
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

      <Link to="/tasks/search" className="govuk-link">
        Search for a task by ID
      </Link>

      {loading ? (
        <p className="govuk-body">Loading...</p>
      ) : error ? (
        <ErrorSummary error={error} />
      ) : tasks.length === 0 ? (
        <p className="govuk-body">No tasks available.</p>
      ) : (
        <TaskTable tasks={tasks} />
      )}

      <Link to="/tasks/new" className="govuk-button govuk-button--secondary">
        Create new task
      </Link>
    </div>
  );
}
