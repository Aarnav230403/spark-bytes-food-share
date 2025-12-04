import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { vi, describe, test, beforeEach, expect } from "vitest";

// --- Mocks ---

const navigateMock = vi.fn();

vi.mock("react-router-dom", () => ({
  __esModule: true,
  useNavigate: () => navigateMock,
}));

vi.mock("antd", () => ({
  Button: ({ children, ...props }: any) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  Menu: ({ items, ...props }: any) => (
    <nav {...props}>
      {items?.map((item: any) => (
        <button
          key={item.key}
          type="button"
          onClick={item.onClick}
        >
          {item.label}
        </button>
      ))}
    </nav>
  ),
}));

vi.mock("@/pages/CreateEvent", () => ({
  __esModule: true,
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? (
      <div data-testid="create-event-modal">
        Create Event Modal
        <button type="button" onClick={onClose}>
          Close Modal
        </button>
      </div>
    ) : null,
}));

import Header from "./header";

describe("Header", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders logo and title", () => {
    render(<Header />);

    expect(screen.getByText("TT")).toBeInTheDocument();
    expect(screen.getByText("TerrierTable")).toBeInTheDocument();
  });

  test("renders all main menu items", () => {
    render(<Header />);

    expect(screen.getByRole("button", { name: "Events" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clubs" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "My Events" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "My Reservations" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Profile" })).toBeInTheDocument();
  });

  test("navigates to correct routes when menu items are clicked", async () => {
    render(<Header />);

    await user.click(screen.getByRole("button", { name: "Events" }));
    await user.click(screen.getByRole("button", { name: "Clubs" }));
    await user.click(screen.getByRole("button", { name: "My Events" }));
    await user.click(screen.getByRole("button", { name: "My Reservations" }));
    await user.click(screen.getByRole("button", { name: "Profile" }));

    expect(navigateMock).toHaveBeenCalledWith("/homepage");
    expect(navigateMock).toHaveBeenCalledWith("/clubs");
    expect(navigateMock).toHaveBeenCalledWith("/my-activity");
    expect(navigateMock).toHaveBeenCalledWith("/myreservations");
    expect(navigateMock).toHaveBeenCalledWith("/profile");
  });

  test("navigates home when logo is clicked", async () => {
    render(<Header />);

    await user.click(screen.getByRole("button", { name: /TerrierTable/i }));

    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  test("opens CreateEvent modal when 'Create Event' button is clicked", async () => {
    render(<Header />);

    const button = screen.getByRole("button", { name: /create event/i });
    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(screen.getByTestId("create-event-modal")).toBeInTheDocument();
  });

  test("closes CreateEvent modal when close button is clicked", async () => {
    render(<Header />);

    await user.click(screen.getByRole("button", { name: /create event/i }));
    expect(screen.getByTestId("create-event-modal")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close modal/i }));

    expect(screen.queryByTestId("create-event-modal")).not.toBeInTheDocument();
  });
});
