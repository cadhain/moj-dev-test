import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ViewTaskPage from "./ViewTaskPage";
import { vi } from "vitest";

// Mock formatDateTime
vi.mock("../../utils/date", () => ({
  formatDateTime: (iso: string) => `Formatted: ${iso}`,
}));

describe("ViewTaskPage", () => {
  const mockTask = {
    id: 1,
    title: "Test Task",
    description: "Test Description",
    status: "in_progress",
    due_date: "2025-09-29T12:34:00Z",
  };

  it("renders loading state", () => {
    render(
      <MemoryRouter>
        <ViewTaskPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders error state if fetch fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: false });
    render(
      <MemoryRouter initialEntries={["/tasks/1"]}>
        <Routes>
          <Route path="/tasks/:id" element={<ViewTaskPage />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/task not found/i)).toBeInTheDocument();
    });
  });

  it("renders task details after fetch", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockTask,
    });
    render(
      <MemoryRouter initialEntries={["/tasks/1"]}>
        <Routes>
          <Route path="/tasks/:id" element={<ViewTaskPage />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
      expect(screen.getByDisplayValue("In progress")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("29 September 2025 at 13:34")
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /edit/i })).toHaveAttribute(
        "href",
        "/tasks/1/edit"
      );
      expect(screen.getByRole("link", { name: /delete/i })).toHaveAttribute(
        "href",
        "/tasks/1/delete"
      );
    });
  });

  it("renders task details from prop without fetching", () => {
    render(
      <MemoryRouter>
        <ViewTaskPage task={mockTask} />
      </MemoryRouter>
    );
    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
    expect(screen.getByDisplayValue("In progress")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("29 September 2025 at 13:34")
    ).toBeInTheDocument();
  });

  it("does not render breadcrumbs if showBreadcrumbs is false", () => {
    render(
      <MemoryRouter>
        <ViewTaskPage task={mockTask} showBreadcrumbs={false} />
      </MemoryRouter>
    );
    expect(
      screen.queryByRole("navigation", { name: /breadcrumb/i })
    ).not.toBeInTheDocument();
  });
});
