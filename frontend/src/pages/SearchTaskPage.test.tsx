import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import SearchTaskPage from "./SearchTaskPage";

describe("SearchTaskPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders the search form", () => {
    render(
      <MemoryRouter>
        <SearchTaskPage />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/task id/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("shows loading state when searching", async () => {
    globalThis.fetch = vi.fn(() => new Promise(() => {})) as any;
    render(
      <MemoryRouter>
        <SearchTaskPage />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/task id/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows task details when found", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        title: "Test Task",
        description: "Test Description",
        status: "todo",
        due_date: "2025-09-29T12:00:00Z",
      }),
    });

    render(
      <MemoryRouter>
        <SearchTaskPage />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/task id/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/task title/i)).toHaveValue("Test Task");
      expect(screen.getByLabelText(/description/i)).toHaveValue(
        "Test Description"
      );
      expect(screen.getByLabelText(/status/i)).toHaveValue("To do");
      expect(screen.getByLabelText(/due date/i)).toHaveValue(
        "29 September 2025 at 13:00"
      );
    });
  });

  it("shows error if task not found", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: false });

    render(
      <MemoryRouter>
        <SearchTaskPage />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/task id/i), {
      target: { value: "999" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText(/task not found/i)).toBeInTheDocument();
    });
  });
});
