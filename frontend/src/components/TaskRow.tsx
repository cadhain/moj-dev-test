import { Link } from "react-router-dom";
import type { Task } from "../pages/TaskListPage";

type TaskRowProps = {
  task: Task;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const statusLabels: Record<string, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

const statusTagClasses: Record<string, string> = {
  todo: "govuk-tag govuk-tag--grey",
  in_progress: "govuk-tag govuk-tag--blue",
  done: "govuk-tag govuk-tag--green",
};

export default function TaskRow({ task }: TaskRowProps) {
  return (
    <tr className="govuk-table__row">
      <td className="govuk-table__cell">{task.id}</td>
      <td className="govuk-table__cell">{task.title}</td>
      <td className="govuk-table__cell">
        <strong className={statusTagClasses[task.status] || "govuk-tag"}>
          {statusLabels[task.status] || task.status}
        </strong>
      </td>
      <td className="govuk-table__cell">{formatDate(task.due_date)}</td>
      <td className="govuk-table__cell">
        <Link
          to={`/tasks/${task.id}/edit`}
          className="govuk-link"
          role="button"
          draggable="false"
        >
          Edit
        </Link>
        <span className="govuk-!-margin-left-3">
          <Link
            to={`/tasks/${task.id}/delete`}
            className="govuk-link govuk-link--destructive"
            role="button"
            draggable="false"
          >
            Delete
          </Link>
        </span>
      </td>
    </tr>
  );
}
