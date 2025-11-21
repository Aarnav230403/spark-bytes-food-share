import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, test, beforeEach, vi, expect } from "vitest";
import EventDetail from "./EventDetail";

// Mock supabase client
vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    rpc: vi.fn(),
  },
}));

// Mock antd UI + message API so we can assert on calls
vi.mock("antd", () => ({
  // Simple mock Modal that still renders children
  Modal: ({ open, onCancel, title, children }: any) =>
    open ? (
      <div data-testid="modal">
        <h2>{title}</h2>
        {children}
        <button onClick={onCancel}>Close</button>
      </div>
    ) : null,
  Card: ({ children }: any) => <div>{children}</div>,
  Tag: ({ children }: any) => <span>{children}</span>,
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  message: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
  },
}));

import { supabase } from "../lib/supabaseClient";
import { message } from "antd";

const mockedSupabase = supabase as unknown as {
  auth: { getUser: ReturnType<typeof vi.fn> };
  rpc: ReturnType<typeof vi.fn>;
};

const mockedMessage = message as unknown as {
  error: ReturnType<typeof vi.fn>;
  success: ReturnType<typeof vi.fn>;
  warning: ReturnType<typeof vi.fn>;
};

const baseEvent = {
  id: 1,
  title: "Free Pizza Event",
  location: "Student Center",
  start_time: "12:00",
  end_time: "13:00",
  campus: ["Main Campus"],
  dietary: ["Vegan"],
  food_items: [{ name: "Cheese Pizza", qty: 3 }],
  notes: "Come early!",
};

describe("EventDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns null when no event is provided", () => {
    const { queryByTestId } = render(
      <EventDetail event={null as any} open={true} onOpenChange={() => {}} />
    );

    expect(queryByTestId("modal")).not.toBeInTheDocument();
  });

  test("renders event details when event is provided", () => {
    render(<EventDetail event={baseEvent} open={true} onOpenChange={() => {}} />);

    // Modal title
    expect(screen.getByText("Free Pizza Event")).toBeInTheDocument();

    // Location
    expect(screen.getByText("Student Center")).toBeInTheDocument();

    // Time range
    expect(screen.getByText(/12:00 - 13:00/)).toBeInTheDocument();

    // Campus tag
    expect(screen.getByText("Main Campus")).toBeInTheDocument();

    // Dietary tag
    expect(screen.getByText("Vegan")).toBeInTheDocument();

    // Food item + qty
    expect(screen.getByText("Cheese Pizza")).toBeInTheDocument();
    expect(screen.getByText(/Qty: 3/)).toBeInTheDocument();


    expect(screen.getByText("Come early!")).toBeInTheDocument();
  });

  test("calls onOpenChange(false) when modal is closed", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<EventDetail event={baseEvent} open={true} onOpenChange={onOpenChange} />);

    await user.click(screen.getByText("Close"));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test("shows error message if user is not logged in when reserving food", async () => {
    const user = userEvent.setup();

    (mockedSupabase.auth.getUser as any).mockResolvedValue({
      data: { user: null },
    });

    render(<EventDetail event={baseEvent} open={true} onOpenChange={() => {}} />);

    await user.click(screen.getByRole("button", { name: /reserve/i }));

    expect(mockedMessage.error).toHaveBeenCalledWith("Please log in first");
    expect(mockedSupabase.rpc).not.toHaveBeenCalled();
  });

  test("calls supabase RPC and shows success message when reservation succeeds", async () => {
    const user = userEvent.setup();

    (mockedSupabase.auth.getUser as any).mockResolvedValue({
      data: { user: { id: "user-123" } },
    });

    (mockedSupabase.rpc as any).mockResolvedValue({
      data: "ok",
      error: null,
    });

    render(<EventDetail event={{ ...baseEvent }} open={true} onOpenChange={() => {}} />);

    await user.click(screen.getByRole("button", { name: /reserve/i }));

    expect(mockedSupabase.rpc).toHaveBeenCalledWith("reserve_food", {
      event_id: 1,
      food_index: 0,
      user_id: "user-123",
    });

    expect(mockedMessage.success).toHaveBeenCalledWith(
      "Reserved successfully!",
      expect.any(Number));
  });

  test("shows warning when item is sold out from RPC response", async () => {
    const user = userEvent.setup();

    (mockedSupabase.auth.getUser as any).mockResolvedValue({
      data: { user: { id: "user-123" } },
    });

    (mockedSupabase.rpc as any).mockResolvedValue({
      data: "sold_out",
      error: null,
    });

    render(<EventDetail event={baseEvent} open={true} onOpenChange={() => {}} />);

    await user.click(screen.getByRole("button", { name: /reserve/i }));

    expect(mockedMessage.warning).toHaveBeenCalledWith(
      "This item is already sold out."
    );
  });

  test("shows error message when RPC returns other status", async () => {
    const user = userEvent.setup();

    (mockedSupabase.auth.getUser as any).mockResolvedValue({
      data: { user: { id: "user-123" } },
    });

    (mockedSupabase.rpc as any).mockResolvedValue({
      data: "event_not_found",
      error: null,
    });

    render(<EventDetail event={baseEvent} open={true} onOpenChange={() => {}} />);

    await user.click(screen.getByRole("button", { name: /reserve/i }));

    expect(mockedMessage.error).toHaveBeenCalledWith("event_not_found");
  });

  test("disables reserve button when qty is 0", () => {
    const eventWithSoldOut = {
      ...baseEvent,
      food_items: [{ name: "Cheese Pizza", qty: 0 }],
    };

    render(<EventDetail event={eventWithSoldOut} open={true} onOpenChange={() => {}} />);

    const button = screen.getByRole("button", { name: /sold out/i });
    expect(button).toBeDisabled();
  });
});
