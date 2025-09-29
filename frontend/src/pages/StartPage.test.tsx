import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import StartPage from "./StartPage";

describe("StartPage", () => {
  it("renders the welcome message and start button", () => {
    render(
      <MemoryRouter>
        <StartPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Welcome to Task Manager"
    );
    expect(
      screen.getByText(/create, view, edit, and delete tasks/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /start/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /start/i })).toHaveAttribute(
      "href",
      "/tasks"
    );
  });
});
