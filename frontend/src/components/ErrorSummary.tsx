type ErrorSummaryProps =
  | { error: string | null; errors?: undefined }
  | { errors: Record<string, string>; error?: undefined };

export default function ErrorSummary(props: ErrorSummaryProps) {
  if (
    "errors" in props &&
    props.errors &&
    Object.keys(props.errors).length > 0
  ) {
    return (
      <div
        className="govuk-error-summary"
        role="alert"
        aria-labelledby="error-summary-title"
        tabIndex={-1}
      >
        <h2 className="govuk-error-summary__title" id="error-summary-title">
          There is a problem
        </h2>
        <ul className="govuk-list govuk-error-summary__list">
          {Object.entries(props.errors).map(([field, message]) => (
            <li key={field}>
              <a href={`#${field}`}>{message}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if ("error" in props && props.error) {
    return (
      <div
        className="govuk-error-summary"
        role="alert"
        aria-labelledby="error-summary-title"
        tabIndex={-1}
      >
        <h2 className="govuk-error-summary__title" id="error-summary-title">
          There is a problem
        </h2>
        <ul className="govuk-list govuk-error-summary__list">
          <li>{props.error}</li>
        </ul>
      </div>
    );
  }

  return null;
}
