import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TaskListPage from "./TaskListPage";
import { vi } from "vitest";

// Mock fetch
const mockTasks = Array.from({ length: 15 }, (_, i) => ({
  id: String(i + 1),
  title: `Task ${i + 1}`,
  description: `Description ${i + 1}`,
  status: "todo",
  due_date: "2025-09-29T12:00:00Z",
}));

describe("TaskListPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("shows loading state initially", () => {
    globalThis.fetch = vi.fn(() => new Promise(() => {})) as any;
    render(
      <MemoryRouter>
        <TaskListPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows error summary if fetch fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Server Error",
    });
    render(
      <MemoryRouter>
        <TaskListPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/there is a problem/i)).toBeInTheDocument();
      expect(screen.getByText(/error 500/i)).toBeInTheDocument();
    });
  });

  it("shows empty state if no tasks", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });
    render(
      <MemoryRouter>
        <TaskListPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/no tasks available/i)).toBeInTheDocument();
    });
  });

  it("shows tasks and paginates correctly", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks,
    });
    render(
      <MemoryRouter>
        <TaskListPage />
      </MemoryRouter>
    );
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 10")).toBeInTheDocument();
    });
    // Should not show Task 11 on first page
    expect(screen.queryByText("Task 11")).not.toBeInTheDocument();

    // Click next page
    fireEvent.click(screen.getByRole("link", { name: /next/i }));
    await waitFor(() => {
      expect(screen.getByText("Task 11")).toBeInTheDocument();
      expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    });

    // Click previous page
    fireEvent.click(screen.getByRole("link", { name: /previous/i }));
    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });
  });

  it("shows navigation buttons", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });
    render(
      <MemoryRouter>
        <TaskListPage />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("link", { name: /create new task/i })
    ).toHaveAttribute("href", "/tasks/new");
    expect(
      screen.getByRole("link", { name: /search for a task by id/i })
    ).toHaveAttribute("href", "/tasks/search");
  });
});
