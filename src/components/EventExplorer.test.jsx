import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import EventExplorer from "./EventExplorer.jsx";

describe("EventExplorer", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the event search interface", async () => {
    render(<EventExplorer />);

    expect(screen.getByLabelText("Search events")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search by event, category, or venue")
    ).toBeInTheDocument();
  });

  it("filters events when the user searches", async () => {
    render(<EventExplorer />);

    const searchInput = screen.getByPlaceholderText(
      "Search by event, category, or venue"
    );

    fireEvent.change(searchInput, {
      target: { value: "AI" },
    });

    expect(screen.getByText(/events found/i)).toBeInTheDocument();
  });

  it("allows users to save an event", async () => {
    render(<EventExplorer />);

    const saveButtons = screen.getAllByRole("button", {
      name: /save/i,
    });

    fireEvent.click(saveButtons[0]);

    expect(
      screen.getByRole("button", { name: /remove.*from favourites/i })
    ).toBeInTheDocument();
  });
});