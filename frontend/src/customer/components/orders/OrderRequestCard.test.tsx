import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { OrderRequestCard } from "./OrderRequestCard";
import type { Request } from "../../types";

// ---------------------------------------------------------------------------
// OrderRequestCard — status-driven rendering + accept/cancel flows.
// fetch is stubbed for the quotes endpoint; motion animations are fine in
// jsdom since they degrade gracefully.
// ---------------------------------------------------------------------------

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

const baseRequest: Request = {
  id: "ORD-1",
  title: "Rice & Curry Feast",
  date: "2026-09-20",
  guests: 4,
  budget: 6000,
  status: "Pending",
  bids: 2,
  location: "Colombo",
  dietary: [],
  description: "Family dinner STATUS: Pending",
};

function renderCard(request: Request, onRefresh?: () => void) {
  return render(
    <MemoryRouter>
      <OrderRequestCard request={request} index={0} onRefresh={onRefresh} />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  fetchMock.mockReset();
  localStorage.clear();
  localStorage.setItem("user", JSON.stringify({ uid: "u-cust-1" }));
  // jsdom has no confirm — default to "accepted" and override per test.
  vi.stubGlobal("confirm", vi.fn(() => true));
});

describe("rendering by status", () => {
  it("shows the status badge, meta and total for an open order", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    renderCard(baseRequest);

    expect(screen.getByText("Rice & Curry Feast")).toBeInTheDocument();
    // "Pending" appears in both the status badge and the progress tracker.
    expect(screen.getAllByText("Pending").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("4 Guests")).toBeInTheDocument();
    expect(screen.getByText("LKR 6,000")).toBeInTheDocument();
    expect(screen.getByText("2 bids")).toBeInTheDocument();

    // Open orders expose the cancel action.
    expect(
      screen.getByRole("button", { name: /cancel request/i }),
    ).toBeInTheDocument();
  });

  it("hides the progress tracker and cancel button for cancelled orders", () => {
    renderCard({ ...baseRequest, description: "x STATUS: Cancelled" });

    expect(screen.getByText("Cancelled")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /cancel request/i }),
    ).not.toBeInTheDocument();
  });

  it("does not fetch quotes for non-open orders", () => {
    renderCard({ ...baseRequest, description: "x STATUS: Delivered" });

    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("incoming quotes", () => {
  it("lists chef quotes with price and accept buttons", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "QT-1",
          orderId: "ORD-1",
          chefId: "u-chef-1",
          price: 5500,
          note: "I can do this",
          fulfillmentTime: "17:00",
          status: "Pending",
          chefName: "Chef Ranjan",
          chefAvatar: null,
        },
      ],
    });

    renderCard(baseRequest);

    await waitFor(() =>
      expect(screen.getByText("Chef Ranjan")).toBeInTheDocument(),
    );
    expect(screen.getByText("LKR 5,500")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /accept/i })).toBeInTheDocument();
  });

  it("shows the empty state when no quotes exist", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });

    renderCard(baseRequest);

    await waitFor(() =>
      expect(
        screen.getByText(/No quotes yet — chefs are reviewing/i),
      ).toBeInTheDocument(),
    );
  });
});

describe("accept flow", () => {
  it("calls the accept endpoint and refreshes after confirm", async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    fetchMock
      // quotes fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "QT-1",
            orderId: "ORD-1",
            chefId: "u-chef-1",
            price: 5500,
            note: null,
            fulfillmentTime: null,
            status: "Pending",
            chefName: "Chef Ranjan",
            chefAvatar: null,
          },
        ],
      })
      // accept call
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    renderCard(baseRequest, onRefresh);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /accept/i })).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /accept/i }));

    await waitFor(() => expect(onRefresh).toHaveBeenCalledTimes(1));
    const acceptCall = fetchMock.mock.calls.find(([url]) =>
      String(url).includes("/accept"),
    );
    expect(acceptCall).toBeTruthy();
    expect(JSON.parse(acceptCall![1].body)).toEqual({
      quoteId: "QT-1",
      customerId: "u-cust-1",
    });
  });

  it("does nothing when the confirm dialog is dismissed", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("confirm", vi.fn(() => false));
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "QT-1",
          orderId: "ORD-1",
          chefId: "u-chef-1",
          price: 5500,
          note: null,
          fulfillmentTime: null,
          status: "Pending",
          chefName: "Chef Ranjan",
          chefAvatar: null,
        },
      ],
    });

    renderCard(baseRequest);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /accept/i })).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /accept/i }));
    expect(fetchMock.mock.calls.filter(([url]) => String(url).includes("/accept"))).toHaveLength(0);
  });
});

describe("cancel flow", () => {
  it("calls the cancel endpoint after confirm", async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // quotes
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // cancel

    renderCard(baseRequest, onRefresh);
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /cancel request/i }),
      ).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /cancel request/i }));

    await waitFor(() => expect(onRefresh).toHaveBeenCalledTimes(1));
    const cancelCall = fetchMock.mock.calls.find(([url]) =>
      String(url).includes("/cancel"),
    );
    expect(cancelCall).toBeTruthy();
    expect(cancelCall![1].method).toBe("PATCH");
  });
});
