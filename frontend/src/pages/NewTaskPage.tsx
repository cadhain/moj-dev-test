import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorSummary from "../components/ErrorSummary";
import Breadcrumbs from "../components/Breadcrumbs";
import { buildIsoDateTime } from "../utils/date";
import { validateTask } from "../utils/validation";

type Status = "todo" | "in_progress" | "done";

const statusOptions: { label: string; value: Status }[] = [
  { label: "To do", value: "todo" },
  { label: "In progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

export default function NewTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("todo");
  const [dueDay, setDueDay] = useState("");
  const [dueMonth, setDueMonth] = useState("");
  const [dueYear, setDueYear] = useState("");
  const [dueHour, setDueHour] = useState("");
  const [dueMinute, setDueMinute] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

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
      const response = await fetch("http://localhost:8000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status,
          due_date: isoDueDate, // send ISO string to FastAPI
        }),
      });

      if (!response.ok) {
        const data = await response.json();

        if (Array.isArray(data.detail)) {
          const backendErrors: Record<string, string> = {};
          data.detail.forEach((err: any) => {
            const field = err.loc[err.loc.length - 1];
            backendErrors[field] = err.msg;
          });
          setErrors(backendErrors);
        } else {
          setErrors({ general: data.detail || "Failed to create task" });
        }
        return;
      }

      // Redirect on success
      navigate("/tasks");
    } catch (err) {
      console.error(err);
      setErrors({ general: "Something went wrong. Please try again." });
    }
  };

  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Object.keys(errors).length > 0 && errorSummaryRef.current) {
      errorSummaryRef.current.focus(); // focus on the error summary
      window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top
    }
  }, [errors]);

  return (
    <div className="govuk-width-container">
      <Breadcrumbs />
      <main className="govuk-main-wrapper " id="main-content" role="main">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <ErrorSummary ref={errorSummaryRef} errors={errors} />
            <h1 className="govuk-heading-l">Create a new task</h1>

            <form onSubmit={handleSubmit} className="govuk-form-group">
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
              <fieldset
                className="govuk-fieldset"
                style={{ marginBottom: "20px" }}
              >
                <legend className="govuk-fieldset__legend">Status</legend>
                <div className="govuk-radios">
                  {statusOptions.map(({ label, value }) => (
                    <div className="govuk-radios__item" key={value}>
                      <input
                        type="radio"
                        className="govuk-radios__input"
                        id={value}
                        name="status"
                        value={value}
                        checked={status === value}
                        onChange={() => setStatus(value)}
                      />
                      <label
                        className="govuk-label govuk-radios__label"
                        htmlFor={value}
                      >
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>

              {/* Due date */}
              <div
                className={`govuk-form-group ${
                  errors.due_date ? "govuk-form-group--error" : ""
                }`}
              >
                <fieldset
                  className="govuk-fieldset"
                  role="group"
                  aria-describedby="due-date-hint"
                >
                  <legend className="govuk-fieldset__legend">Due date</legend>
                  {errors.due_date && (
                    <p id="due-date-error" className="govuk-error-message">
                      <span className="govuk-visually-hidden">Error:</span>{" "}
                      {errors.due_date}
                    </p>
                  )}
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
                        name="day"
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
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
                        name="month"
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
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
                        name="year"
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={dueYear}
                        onChange={(e) => setDueYear(e.target.value)}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>

              {/* Due time */}
              <div
                className={`govuk-form-group ${
                  errors.due_time ? "govuk-form-group--error" : ""
                }`}
              >
                <fieldset
                  className="govuk-fieldset"
                  role="group"
                  aria-describedby="due-time-hint"
                >
                  <legend className="govuk-fieldset__legend">Due time</legend>
                  {errors.due_time && (
                    <p id="due-time-error" className="govuk-error-message">
                      <span className="govuk-visually-hidden">Error:</span>{" "}
                      {errors.due_time}
                    </p>
                  )}
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
                        name="hour"
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
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
                        name="minute"
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={dueMinute}
                        onChange={(e) => setDueMinute(e.target.value)}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>

              {/* buttons */}
              <div className="govuk-button-group">
                <button type="submit" className="govuk-button">
                  Create task
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
}
