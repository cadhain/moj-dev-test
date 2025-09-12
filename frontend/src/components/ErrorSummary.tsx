type ErrorSummaryProps = {
  error: string;
};

export default function ErrorSummary({ error }: ErrorSummaryProps) {
  return (
    <div
      className="govuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex={-1}
    >
      <h2 className="govuk-error-summary__title" id="error-summary-title">
        There was a problem
      </h2>
      <div className="govuk-error-summary__body">
        <p className="govuk-body">{error}</p>
      </div>
    </div>
  );
}
