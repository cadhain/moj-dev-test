import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EditTaskPage from "./EditTaskPage";
import { vi } from "vitest";
import * as validation from "../utils/validation";

// Mock useNavigate and useParams
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
  };
});

// Mock buildIsoDateTime and validateTask
vi.mock("../utils/date", () => ({
  buildIsoDateTime: vi.fn(() => "2025-09-29T12:00:00Z"),
}));
vi.mock("../utils/validation", () => ({
  validateTask: vi.fn(() => ({})),
}));

describe("EditTaskPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("shows loading state initially", () => {
    globalThis.fetch = vi.fn(() => new Promise(() => {})) as any;
    render(
      <MemoryRouter>
        <EditTaskPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows error if fetch fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: false });
    render(
      <MemoryRouter>
        <EditTaskPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch task/i)).toBeInTheDocument();
    });
  });

  it("populates form fields with fetched data", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: "Test Task",
        description: "Test Description",
        status: "in_progress",
        due_date: "2025-09-29T12:34:00Z",
      }),
    });
    render(
      <MemoryRouter>
        <EditTaskPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
      expect(screen.getByDisplayValue("In progress")).toBeInTheDocument();
      expect(screen.getByDisplayValue("29")).toBeInTheDocument(); // day
      expect(screen.getByDisplayValue("09")).toBeInTheDocument(); // month
      expect(screen.getByDisplayValue("2025")).toBeInTheDocument(); // year
      expect(screen.getByDisplayValue("12")).toBeInTheDocument(); // hour
      expect(screen.getByDisplayValue("34")).toBeInTheDocument(); // minute
    });
  });

  it("shows validation errors if form is invalid", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: "",
        description: "",
        status: "todo",
        due_date: "2025-09-29T12:00:00Z",
      }),
    });
    // Mock validateTask to return errors
    vi.mocked(validation.validateTask).mockReturnValue({
      title: "Title is required",
    });

    render(
      <MemoryRouter>
        <EditTaskPage />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByLabelText(/task title/i));
    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      const errorLinks = screen.getAllByText(/title is required/i);
      expect(errorLinks.length).toBeGreaterThan(0);
      errorLinks.forEach((el) => expect(el).toBeInTheDocument());
    });
  });

  it("submits form and navigates on success", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          title: "Test Task",
          description: "Test Description",
          status: "todo",
          due_date: "2025-09-29T12:00:00Z",
        }),
      })
      .mockResolvedValueOnce({ ok: true });

    render(
      <MemoryRouter>
        <EditTaskPage />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByLabelText(/task title/i));
    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "Updated Task" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/tasks");
    });
  });
});
