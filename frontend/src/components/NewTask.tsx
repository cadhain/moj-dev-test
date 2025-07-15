import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Status = "To do" | "In progress" | "Done";

export default function NewTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("To do");
  const [dueDay, setDueDay] = useState("");
  const [dueMonth, setDueMonth] = useState("");
  const [dueYear, setDueYear] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return setError("Task title is required");
    }

    const dueDateString = `${dueYear}-${dueMonth}-${dueDay}`;
    const dueDate = new Date(dueDateString);
    const now = new Date();

    if (isNaN(dueDate.getTime()) || dueDate < now) {
      return setError("Please enter a valid future due date");
    }

    // Mock submit - later replace with POST to backend
    console.log({
      title,
      description,
      status,
      due_date: dueDate.toISOString(),
    });

    // Redirect to task list
    navigate("/tasks");
  };

  return (
    <div className="govuk-width-container">
      <a href="#" className="govuk-back-link" onClick={() => navigate("#")}>
        Back
      </a>
      <main className="govuk-main-wrapper " id="main-content" role="main">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-l">Create a new task</h1>

            {error && <p className="govuk-error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="govuk-form-group">
              <div className="govuk-form-group">
                <label className="govuk-label" htmlFor="title">
                  Task title
                </label>
                <input
                  className="govuk-input"
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

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

              <fieldset
                className="govuk-fieldset"
                style={{ marginBottom: "20px" }}
              >
                <legend className="govuk-fieldset__legend">Status</legend>

                <div className="govuk-radios">
                  {["To do", "In progress", "Done"].map((value) => (
                    <div className="govuk-radios__item" key={value}>
                      <input
                        type="radio"
                        className="govuk-radios__input"
                        id={value}
                        name="status"
                        value={value}
                        checked={status === value}
                        onChange={() => setStatus(value as Status)}
                      />
                      <label
                        className="govuk-label govuk-radios__label"
                        htmlFor={value}
                      >
                        {value}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>

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
