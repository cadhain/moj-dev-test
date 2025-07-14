import { useEffect, useState } from 'react';

type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'To do' | 'In progress' | 'Done';
  due_date: string;
};

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review application forms',
    description: 'Check submitted files against criteria',
    status: 'To do',
    due_date: '2025-08-01T10:00:00',
  },
  {
    id: '2',
    title: 'Email legal team',
    status: 'In progress',
    due_date: '2025-08-03T12:00:00',
  },
];

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Replace with real fetch later
    setTasks(mockTasks);
  }, []);

  return (
    <div className="govuk-width-container">
      <h1 className="govuk-heading-l">Your tasks</h1>

      {tasks.length === 0 ? (
        <p className="govuk-body">No tasks available.</p>
      ) : (
        <table className="govuk-table">
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th className="govuk-table__header">Title</th>
              <th className="govuk-table__header">Status</th>
              <th className="govuk-table__header">Due date</th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {tasks.map((task) => (
              <tr className="govuk-table__row" key={task.id}>
                <td className="govuk-table__cell">{task.title}</td>
                <td className="govuk-table__cell">{task.status}</td>
                <td className="govuk-table__cell">
                  {new Date(task.due_date).toLocaleString('en-GB', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
