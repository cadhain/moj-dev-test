import { render, screen } from "@testing-library/react";

function Hello() {
  return <h1>Hello, Test!</h1>;
}

describe("smoke test", () => {
  it("renders hello message", () => {
    render(<Hello />);
    expect(screen.getByText("Hello, Test!")).toBeInTheDocument();
  });
});
