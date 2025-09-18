import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";

const statusOptions = [
  { label: "To do", value: "todo" },
  { label: "In progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

const EditTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [dueDay, setDueDay] = useState("");
  const [dueMonth, setDueMonth] = useState("");
  const [dueYear, setDueYear] = useState("");
  const [dueHour, setDueHour] = useState("");
  const [dueMinute, setDueMinute] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/tasks/${id}`);
        if (!response.ok) throw new Error("Failed to fetch task");
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description || "");
        setStatus(data.status);

        // Parse date/time parts
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

    const dueDateISO = `${dueYear}-${dueMonth.padStart(
      2,
      "0"
    )}-${dueDay.padStart(2, "0")}T${dueHour.padStart(
      2,
      "0"
    )}:${dueMinute.padStart(2, "0")}:00Z`;

    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          due_date: dueDateISO,
          status,
        }),
      });
      if (!response.ok) throw new Error("Failed to update task");
      navigate("/tasks");
    } catch (err: any) {
      setError(err.message || "Error updating task");
    }
  };

  if (loading) return <div className="govuk-width-container">Loading...</div>;
  if (error)
    return (
      <div className="govuk-width-container govuk-error-message">{error}</div>
    );

  return (
    <div className="govuk-width-container">
      <Breadcrumbs />
      <main className="govuk-main-wrapper" id="main-content">
        <h1 className="govuk-heading-l">Edit Task</h1>
        <form onSubmit={handleSubmit}>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="title">
              Task title
            </label>
            <input
              className="govuk-input"
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="status">
              Status
            </label>
            <select
              className="govuk-select"
              id="status"
              name="status"
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
          <div className="govuk-form-group">
            <label className="govuk-label">Due date and time</label>
            <div
              style={{ display: "flex", gap: "0.5em", alignItems: "center" }}
            >
              <input
                className="govuk-input"
                style={{ width: "4em" }}
                id="due_day"
                name="due_day"
                type="number"
                min="1"
                max="31"
                placeholder="DD"
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                required
              />
              /
              <input
                className="govuk-input"
                style={{ width: "4em" }}
                id="due_month"
                name="due_month"
                type="number"
                min="1"
                max="12"
                placeholder="MM"
                value={dueMonth}
                onChange={(e) => setDueMonth(e.target.value)}
                required
              />
              /
              <input
                className="govuk-input"
                style={{ width: "6em" }}
                id="due_year"
                name="due_year"
                type="number"
                min="1900"
                max="2100"
                placeholder="YYYY"
                value={dueYear}
                onChange={(e) => setDueYear(e.target.value)}
                required
              />
              &nbsp;at&nbsp;
              <input
                className="govuk-input"
                style={{ width: "4em" }}
                id="due_hour"
                name="due_hour"
                type="number"
                min="0"
                max="23"
                placeholder="HH"
                value={dueHour}
                onChange={(e) => setDueHour(e.target.value)}
                required
              />
              :
              <input
                className="govuk-input"
                style={{ width: "4em" }}
                id="due_minute"
                name="due_minute"
                type="number"
                min="0"
                max="59"
                placeholder="MM"
                value={dueMinute}
                onChange={(e) => setDueMinute(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="govuk-button-group">
            <button
              type="submit"
              className="govuk-button"
              data-module="govuk-button"
            >
              Save changes
            </button>
            <a className="govuk-link" href="/tasks">
              Cancel
            </a>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditTaskPage;
