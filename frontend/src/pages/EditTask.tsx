import React from "react";
import { useParams } from "react-router-dom";

const EditTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="govuk-main-wrapper" id="main-content">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-l">Edit Task #{id}</h1>
          <p className="govuk-body">Edit page coming soon.</p>
        </div>
      </div>
    </main>
  );
};

export default EditTask;
