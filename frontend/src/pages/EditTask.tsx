import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

const EditTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Temporary hardcoded values - will be fetched from API later
  const [title, setTitle] = useState("Example task title");
  const [description, setDescription] = useState("Example task description");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit edit task:", { id, title, description });

    // Later: send PUT/PATCH to API endpoint
  };

  return (
    <div className="govuk-width-container">
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

          <button type="submit" className="govuk-button">
            Save changes
          </button>

          <Link to="/tasks" className="govuk-link govuk-!-margin-left-3">
            Cancel
          </Link>
        </form>
      </main>
    </div>
  );
};

export default EditTaskPage;
