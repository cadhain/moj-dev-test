import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import { buildIsoDateTime } from "../utils/date";
import ErrorSummary from "../components/ErrorSummary";
import { validateTask } from "../utils/validation";

const statusOptions = [
  { label: "To do", value: "todo" },
  { label: "In progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

const EditTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [dueDay, setDueDay] = useState("");
  const [dueMonth, setDueMonth] = useState("");
  const [dueYear, setDueYear] = useState("");
  const [dueHour, setDueHour] = useState("");
  const [dueMinute, setDueMinute] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null); // general error

  // Fetch existing task(s) when page loads
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/tasks/${id}`);
        if (!response.ok) throw new Error("Failed to fetch task");
        const data = await response.json();

        setTitle(data.title);
        setDescription(data.description || "");
        setStatus(data.status);

        // Parse existing date/time
        const date = new Date(data.due_date);
        setDueYear(String(date.getFullYear()));
        setDueMonth(String(date.getMonth() + 1).padStart(2, "0"));
        setDueDay(String(date.getDate()).padStart(2, "0"));
        setDueHour(String(date.getHours()).padStart(2, "0"));
        setDueMinute(String(date.getMinutes()).padStart(2, "0"));
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

    const newErrors = validateTask({
      title,
      description,
      dueDay,
      dueMonth,
      dueYear,
      dueHour,
      dueMinute,
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const summary = document.querySelector<HTMLElement>(
        ".govuk-error-summary"
      );
      if (summary) summary.focus();
      return;
    }

    // Build ISO string only if valid
    const isoDueDate = buildIsoDateTime(
      dueYear,
      dueMonth,
      dueDay,
      dueHour,
      dueMinute
    );

    setErrors({});

    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          due_date: isoDueDate,
          status,
        }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      navigate("/tasks");
    } catch (err: any) {
      setError(err.message || "Error updating task");
    }
  };

  // UI States
  if (loading) return <div className="govuk-width-container">Loading...</div>;
  if (error)
    return (
      <div className="govuk-width-container govuk-error-message">{error}</div>
    );

  return (
    <div className="govuk-width-container">
      <Breadcrumbs />
      <main className="govuk-main-wrapper" id="main-content">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-l">Edit Task</h1>

            {/* Show validation summary if errors exist */}
            {Object.keys(errors).length > 0 && <ErrorSummary errors={errors} />}

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div
                className={`govuk-form-group ${
                  errors.title ? "govuk-form-group--error" : ""
                }`}
              >
                <label className="govuk-label" htmlFor="title">
                  Task title
                </label>
                {errors.title && (
                  <p id="title-error" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>{" "}
                    {errors.title}
                  </p>
                )}
                <div
                  className="govuk-character-count"
                  data-module="govuk-character-count"
                  data-maxlength="60"
                >
                  <input
                    className="govuk-input govuk-js-character-count"
                    id="title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    aria-describedby={`title-info ${
                      errors.title ? "title-error" : ""
                    }`}
                  />
                  <div
                    id="title-info"
                    className="govuk-hint govuk-character-count__message"
                  >
                    You can enter up to 60 characters
                  </div>
                </div>
              </div>

              {/* Description */}
              <div
                className={`govuk-form-group ${
                  errors.description ? "govuk-form-group--error" : ""
                }`}
              >
                <label className="govuk-label" htmlFor="description">
                  Description (optional)
                </label>
                {errors.description && (
                  <p id="description-error" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>{" "}
                    {errors.description}
                  </p>
                )}
                <div
                  className="govuk-character-count"
                  data-module="govuk-character-count"
                  data-maxlength="2000"
                >
                  <textarea
                    className="govuk-textarea govuk-js-character-count"
                    id="description"
                    name="description"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    aria-describedby="description-info"
                  ></textarea>
                  <div
                    id="description-info"
                    className="govuk-hint govuk-character-count__message"
                  >
                    You can enter up to 2000 characters
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="govuk-form-group">
                <label className="govuk-label" htmlFor="status">
                  Status
                </label>
                <select
                  className="govuk-select"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due date */}
              <div className="govuk-form-group">
                <fieldset
                  className="govuk-fieldset"
                  role="group"
                  aria-describedby="due-date-hint"
                >
                  <legend className="govuk-fieldset__legend">Due date</legend>
                  <div id="due-date-hint" className="govuk-hint">
                    For example, 31 08 2025
                  </div>
                  <div className="govuk-date-input" id="due-date">
                    <div className="govuk-date-input__item">
                      <label className="govuk-label" htmlFor="day">
                        Day
                      </label>
                      <input
                        className="govuk-input govuk-date-input__input govuk-input--width-2"
                        id="day"
                        type="text"
                        value={dueDay}
                        onChange={(e) => setDueDay(e.target.value)}
                      />
                    </div>
                    <div className="govuk-date-input__item">
                      <label className="govuk-label" htmlFor="month">
                        Month
                      </label>
                      <input
                        className="govuk-input govuk-date-input__input govuk-input--width-2"
                        id="month"
                        type="text"
                        value={dueMonth}
                        onChange={(e) => setDueMonth(e.target.value)}
                      />
                    </div>
                    <div className="govuk-date-input__item">
                      <label className="govuk-label" htmlFor="year">
                        Year
                      </label>
                      <input
                        className="govuk-input govuk-date-input__input govuk-input--width-4"
                        id="year"
                        type="text"
                        value={dueYear}
                        onChange={(e) => setDueYear(e.target.value)}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>

              {/* Due time */}
              <div className="govuk-form-group">
                <fieldset
                  className="govuk-fieldset"
                  role="group"
                  aria-describedby="due-time-hint"
                >
                  <legend className="govuk-fieldset__legend">Due time</legend>
                  <div id="due-time-hint" className="govuk-hint">
                    Use 24-hour format, for example, 14 30
                  </div>
                  <div className="govuk-date-input" id="due-time">
                    <div className="govuk-date-input__item">
                      <label className="govuk-label" htmlFor="hour">
                        Hour
                      </label>
                      <input
                        className="govuk-input govuk-date-input__input govuk-input--width-2"
                        id="hour"
                        type="text"
                        value={dueHour}
                        onChange={(e) => setDueHour(e.target.value)}
                      />
                    </div>
                    <div className="govuk-date-input__item">
                      <label className="govuk-label" htmlFor="minute">
                        Minute
                      </label>
                      <input
                        className="govuk-input govuk-date-input__input govuk-input--width-2"
                        id="minute"
                        type="text"
                        value={dueMinute}
                        onChange={(e) => setDueMinute(e.target.value)}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>

              {/* Buttons */}
              <div className="govuk-button-group">
                <button type="submit" className="govuk-button">
                  Save changes
                </button>
                <a className="govuk-link" href="/tasks">
                  Cancel
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditTaskPage;
