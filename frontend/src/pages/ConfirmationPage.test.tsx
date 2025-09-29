import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ConfirmationPage from "./ConfirmationPage";

describe("ConfirmationPage", () => {
  it("renders the deleted task title from navigation state", () => {
    const state = { taskTitle: "Test Task" };
    render(
      <MemoryRouter initialEntries={[{ pathname: "/tasks/deleted", state }]}>
        <Routes>
          <Route path="/tasks/deleted" element={<ConfirmationPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Test Task/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Task deleted"
    );
    expect(
      screen.getByRole("link", { name: /return to your tasks/i })
    ).toHaveAttribute("href", "/tasks");
  });

  it("renders fallback text if no taskTitle in state", () => {
    render(
      <MemoryRouter initialEntries={["/tasks/deleted"]}>
        <Routes>
          <Route path="/tasks/deleted" element={<ConfirmationPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/the task/i)).toBeInTheDocument();
    expect(screen.getByText(/has been deleted/i)).toBeInTheDocument();
  });
});
