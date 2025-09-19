interface TaskFormValues {
  title: string;
  description: string;
  dueDay: string;
  dueMonth: string;
  dueYear: string;
  dueHour: string;
  dueMinute: string;
}

export function validateTask(values: TaskFormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  const { title, description, dueDay, dueMonth, dueYear, dueHour, dueMinute } =
    values;

  // Title
  if (!title.trim()) {
    errors.title = "Enter a task title";
  } else if (title.length > 60) {
    errors.title = "Task title must be 60 characters or fewer";
  }

  // Description
  if (description.length > 2000) {
    errors.description = "Description must be 2000 characters or fewer";
  }

  // Date
  if (!dueDay || !dueMonth || !dueYear) {
    errors.due_date = "Enter a due date";
  } else {
    const day = parseInt(dueDay, 10);
    const month = parseInt(dueMonth, 10) - 1; // JS months 0-11
    const year = parseInt(dueYear, 10);
    const hour = parseInt(dueHour || "0", 10);
    const minute = parseInt(dueMinute || "0", 10);

    const dueDate = new Date(year, month, day, hour, minute);
    const now = new Date();

    if (isNaN(dueDate.getTime())) {
      errors.due_date = "Enter a valid date";
    } else if (dueDate < now) {
      errors.due_date = "Due date must be in the future";
    }
  }

  // Time
  if (!dueHour || !dueMinute) {
    errors.due_time = "Enter a due time";
  } else {
    const h = parseInt(dueHour, 10);
    const m = parseInt(dueMinute, 10);
    if (isNaN(h) || h < 0 || h > 23) errors.due_time = "Hour must be 0–23";
    if (isNaN(m) || m < 0 || m > 59) errors.due_time = "Minute must be 0–59";
  }

  return errors;
}
