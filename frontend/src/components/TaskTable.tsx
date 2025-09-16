import TaskRow from "././TaskRow";
import type { Task } from "../pages/TaskListPage";

type TaskTableProps = {
  tasks: Task[];
};

export default function TaskTable({ tasks }: TaskTableProps) {
  return (
    <table className="govuk-table">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th className="govuk-table__header">ID</th>
          <th className="govuk-table__header">Title</th>
          <th className="govuk-table__header">Status</th>
          <th className="govuk-table__header">Due date</th>
          <th className="govuk-table__header">Action</th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </tbody>
    </table>
  );
}
