import Breadcrumbs from "../components/Breadcrumbs";

export default function StartPage() {
  return (
    <div className="govuk-width-container">
      <Breadcrumbs />
      <h1 className="govuk-heading-l">Welcome to Task Manager</h1>
      <p className="govuk-body">
        This application allows you to create, view, edit, and delete tasks.
      </p>
      <p className="govuk-body">
        Click the Start button to begin managing your tasks.
      </p>
      <a href="/tasks" className="govuk-button">
        Start
      </a>
    </div>
  );
}
