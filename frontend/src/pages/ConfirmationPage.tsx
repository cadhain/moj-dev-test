import { useLocation, Link } from "react-router-dom";

export default function ConfirmationPage() {
  const location = useLocation();
  // Fallback if state is missing
  const taskTitle = location.state?.taskTitle || "the task";

  return (
    <div className="govuk-width-container">
      <main
        className="govuk-main-wrapper govuk-main-wrapper--l"
        id="main-content"
        role="main"
      >
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <div className="govuk-panel govuk-panel--confirmation">
              <h1 className="govuk-panel__title">Task deleted</h1>
              <div className="govuk-panel__body">
                <strong>{taskTitle}</strong> has been deleted.
              </div>
            </div>
            <p className="govuk-body">
              <Link to="/tasks" className="govuk-link">
                Return to your tasks
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
