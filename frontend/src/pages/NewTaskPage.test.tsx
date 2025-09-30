import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NewTask from "./NewTaskPage";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock utils
vi.mock("../utils/validation", () => ({
  validateTask: vi.fn(),
}));

vi.mock("../utils/date", () => ({
  buildIsoDateTime: vi.fn(() => "2025-09-29T13:00:00Z"),
}));

describe("NewTaskPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders all form fields correctly", () => {
    render(
      <MemoryRouter>
        <NewTask />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/day/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/month/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hour/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/minute/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create task/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows validation errors when required fields are empty", async () => {
    const { validateTask } = await import("../utils/validation");
    (validateTask as any).mockReturnValue({
      title: "Title is required",
      dueDay: "Due day is required",
    });

    render(
      <MemoryRouter>
        <NewTask />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /create task/i }));

    await waitFor(() => {
      const errors = screen.getAllByText(/title is required/i);
      expect(errors.length).toBeGreaterThan(0);
      errors.forEach((el) => expect(el).toBeInTheDocument());
      expect(screen.getByText(/due day is required/i)).toBeInTheDocument();
    });
  });

  it("submits the form successfully and navigates", async () => {
    const { validateTask } = await import("../utils/validation");
    (validateTask as any).mockReturnValue({});

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(
      <MemoryRouter>
        <NewTask />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "My Task" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Desc" },
    });
    fireEvent.change(screen.getByLabelText(/day/i), {
      target: { value: "29" },
    });
    fireEvent.change(screen.getByLabelText(/month/i), {
      target: { value: "09" },
    });
    fireEvent.change(screen.getByLabelText(/year/i), {
      target: { value: "2025" },
    });
    fireEvent.change(screen.getByLabelText(/hour/i), {
      target: { value: "13" },
    });
    fireEvent.change(screen.getByLabelText(/minute/i), {
      target: { value: "00" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create task/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8000/api/tasks",
        expect.any(Object)
      );
      expect(mockNavigate).toHaveBeenCalledWith("/tasks");
    });
  });

  it("displays backend validation errors", async () => {
    const { validateTask } = await import("../utils/validation");
    (validateTask as any).mockReturnValue({});

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        detail: [{ loc: ["body", "title"], msg: "Title already exists" }],
      }),
    });

    render(
      <MemoryRouter>
        <NewTask />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "My Task" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create task/i }));

    await waitFor(() => {
      const errors = screen.getAllByText(/title already exists/i);
      expect(errors.length).toBeGreaterThan(0);
      errors.forEach((el) => expect(el).toBeInTheDocument());
    });
  });

  it("handles fetch/network errors gracefully", async () => {
    const { validateTask } = await import("../utils/validation");
    (validateTask as any).mockReturnValue({});

    globalThis.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network error"));

    render(
      <MemoryRouter>
        <NewTask />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "My Task" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create task/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
