import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TaskTable from "../components/TaskTable";
import Breadcrumbs from "../components/Breadcrumbs";
import ErrorSummary from "../components/ErrorSummary";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  due_date: string;
};

const TASKS_PER_PAGE = 10;

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  // Pagination logic
  const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE);
  const startIdx = (currentPage - 1) * TASKS_PER_PAGE;
  const endIdx = startIdx + TASKS_PER_PAGE;
  const paginatedTasks = tasks.slice(startIdx, endIdx);

  return (
    <div className="govuk-width-container">
      <Breadcrumbs />
      <h1 className="govuk-heading-l">Your tasks</h1>

      {loading ? (
        <p className="govuk-body">Loading...</p>
      ) : error ? (
        <ErrorSummary error={error} />
      ) : tasks.length === 0 ? (
        <p className="govuk-body">No tasks available.</p>
      ) : (
        <>
          <TaskTable tasks={paginatedTasks} />
          {/* Pagination controls */}
          <nav className="govuk-pagination" aria-label="Pagination">
            {currentPage > 1 && (
              <div className="govuk-pagination__prev">
                <a
                  className="govuk-link govuk-pagination__link"
                  href="#"
                  rel="prev"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(currentPage - 1);
                  }}
                >
                  <svg
                    className="govuk-pagination__icon govuk-pagination__icon--prev"
                    xmlns="http://www.w3.org/2000/svg"
                    height="13"
                    width="15"
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 15 13"
                  >
                    <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
                  </svg>
                  <span className="govuk-pagination__link-title">
                    Previous<span className="govuk-visually-hidden"> page</span>
                  </span>
                </a>
              </div>
            )}
            <ul className="govuk-pagination__list">
              {[...Array(totalPages)].map((_, idx) => (
                <li
                  key={idx + 1}
                  className={
                    "govuk-pagination__item" +
                    (currentPage === idx + 1
                      ? " govuk-pagination__item--current"
                      : "")
                  }
                >
                  <a
                    className="govuk-link govuk-pagination__link"
                    href="#"
                    aria-label={`Page ${idx + 1}`}
                    aria-current={currentPage === idx + 1 ? "page" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(idx + 1);
                    }}
                  >
                    {idx + 1}
                  </a>
                </li>
              ))}
            </ul>
            {currentPage < totalPages && (
              <div className="govuk-pagination__next">
                <a
                  className="govuk-link govuk-pagination__link"
                  href="#"
                  rel="next"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(currentPage + 1);
                  }}
                >
                  <span className="govuk-pagination__link-title">
                    Next<span className="govuk-visually-hidden"> page</span>
                  </span>
                  <svg
                    className="govuk-pagination__icon govuk-pagination__icon--next"
                    xmlns="http://www.w3.org/2000/svg"
                    height="13"
                    width="15"
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 15 13"
                  >
                    <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
                  </svg>
                </a>
              </div>
            )}
          </nav>
        </>
      )}

      <Link
        to="/tasks/new"
        className="govuk-button govuk-button--secondary govuk-!-margin-right-2"
      >
        Create new task
      </Link>

      <Link to="/tasks/search" className="govuk-button govuk-button--secondary">
        Search for a task by ID
      </Link>
    </div>
  );
}
