import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DeleteTaskPage from "./DeleteTaskPage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
  };
});

describe("DeleteTaskPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the task title and confirmation message", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ title: "Test Task" }),
    } as any);

    render(
      <BrowserRouter>
        <DeleteTaskPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/are you sure you want to delete this task/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Test Task/)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /yes, delete task/i })
      ).toBeInTheDocument();
    });
  });

  it("calls delete and navigates on confirmation", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ title: "Test Task" }),
      } as any)
      .mockResolvedValueOnce({ ok: true } as any);

    render(
      <BrowserRouter>
        <DeleteTaskPage />
      </BrowserRouter>
    );

    await waitFor(() =>
      screen.getByRole("button", { name: /yes, delete task/i })
    );

    fireEvent.click(screen.getByRole("button", { name: /yes, delete task/i }));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/tasks/deleted", {
        state: { taskTitle: "Test Task" },
      })
    );
  });

  it("shows error if fetch fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: false } as any);

    render(
      <BrowserRouter>
        <DeleteTaskPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/could not load task details/i)
      ).toBeInTheDocument();
    });
  });
});
