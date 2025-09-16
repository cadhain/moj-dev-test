import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorSummary from "../components/ErrorSummary";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Enter a task title";
    }

    let dueDate: Date | null = null;
    if (!dueDay || !dueMonth || !dueYear) {
      newErrors.due_date = "Enter a due date";
    } else {
      const dueDateString = `${dueYear}-${dueMonth.padStart(
        2,
        "0"
      )}-${dueDay.padStart(2, "0")}T00:00:00`;
      dueDate = new Date(dueDateString);
      const now = new Date();

      if (isNaN(dueDate.getTime()) || dueDate < now) {
        newErrors.due_date = "Enter a valid future due date";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
          status: status,
          due_date: dueDate!.toISOString(), // ISO format for FastAPI
        }),
      });

      if (!response.ok) {
        const data = await response.json();

        // FastAPI validation errors come as an array
        if (Array.isArray(data.detail)) {
          const backendErrors: Record<string, string> = {};
          data.detail.forEach((err: any) => {
            const field = err.loc[err.loc.length - 1];
            backendErrors[field] = err.msg;
          });
          setErrors(backendErrors);
        } else setErrors({ general: data.detail || "Failed to create task" });
        return;
      }

      // Task created successfully — redirect to task list
      navigate("/tasks");
    } catch (err) {
      setErrors(errors);
      console.error(err);
    }
  };

  return (
    <div className="govuk-width-container">
      <a
        href="/tasks"
        className="govuk-back-link"
        onClick={() => navigate("/tasks")}
      >
        Back
      </a>
      <main className="govuk-main-wrapper " id="main-content" role="main">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <ErrorSummary errors={errors} />
            <h1 className="govuk-heading-l">Create a new task</h1>

            {/* title field */}
            <form onSubmit={handleSubmit} className="govuk-form-group">
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
                <input
                  className="govuk-input"
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  aria-describedby={errors.title ? "title-error" : undefined}
                />
              </div>

              {/* description field */}
              <div className="govuk-form-group">
                <label className="govuk-label" htmlFor="description">
                  Description (optional)
                </label>
                <textarea
                  className="govuk-textarea"
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              {/* status radios */}
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

              {/* due date fieldset */}
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
                      <label
                        className="govuk-label govuk-date-input__label"
                        htmlFor="day"
                      >
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
                      <label
                        className="govuk-label govuk-date-input__label"
                        htmlFor="month"
                      >
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
                      <label
                        className="govuk-label govuk-date-input__label"
                        htmlFor="year"
                      >
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

              <button
                type="submit"
                className="govuk-button"
                style={{ marginTop: "20px" }}
              >
                Create task
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
