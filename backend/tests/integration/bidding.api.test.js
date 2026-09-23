import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../src/app.js";
import {
  dbAvailable,
  integrationSetup,
  getPool,
} from "../setup/integration.js";
import { createFoodItem, createOrderRow } from "../setup/db.js";

// ---------------------------------------------------------------------------
// Bidding engine — the heart of the platform, tested end-to-end against real
// Postgres: order creation, quote submission/updates, acceptance, cancellation
// and expiry sweeps.
// ---------------------------------------------------------------------------

describe.runIf(dbAvailable)("bidding engine api", () => {
  integrationSetup();

  describe("POST /api/orders", () => {
    it("creates a Pending order with an expiry in the future", async () => {
      const food = await createFoodItem(getPool());

      const res = await request(app).post("/api/orders").send({
        customerId: "u-cust-1",
        mealDescription: "Birthday dinner for 4",
        foodItemId: food.id,
        quantity: 4,
        totalPrice: 6000,
        deliveryDate: "2026-12-01",
        deliveryTime: "18:00",
      });

      expect(res.status).toBe(201);
      expect(res.body.id).toMatch(/^ORD-/);
      expect(res.body.status).toBe("Pending");
      expect(new Date(res.body.expiresAt).getTime()).toBeGreaterThan(Date.now());
    });

    it("rejects orders without a customerId", async () => {
      const res = await request(app)
        .post("/api/orders")
        .send({ mealDescription: "no customer" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Customer ID is required");
    });

    it("rejects orders from an unknown customer", async () => {
      const res = await request(app)
        .post("/api/orders")
        .send({ customerId: "u-ghost", mealDescription: "who am I" });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Customer account not found/);
    });
  });

  describe("POST /api/quotes", () => {
    it("lets a chef bid on an open order", async () => {
      const order = await createOrderRow(getPool());

      const res = await request(app).post("/api/quotes").send({
        orderId: order.id,
        chefId: "u-chef-1",
        price: 2800,
        note: "I can cook this",
        fulfillmentTime: "17:30",
      });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("Pending");
      expect(Number(res.body.price)).toBe(2800);
    });

    it("updates a chef's existing bid instead of duplicating it", async () => {
      const order = await createOrderRow(getPool());
      await request(app).post("/api/quotes").send({
        orderId: order.id,
        chefId: "u-chef-1",
        price: 2800,
      });

      const res = await request(app).post("/api/quotes").send({
        orderId: order.id,
        chefId: "u-chef-1",
        price: 2600,
        note: "Better price",
      });

      expect(res.status).toBe(201);
      expect(Number(res.body.price)).toBe(2600);

      const pool = getPool();
      const quotes = await pool.query(
        "SELECT COUNT(*)::int AS count FROM quotes WHERE order_id = $1",
        [order.id],
      );
      expect(quotes.rows[0].count).toBe(1);
    });

    it("rejects a bid on a missing order with 404", async () => {
      const res = await request(app).post("/api/quotes").send({
        orderId: "ORD-NONEXISTENT",
        chefId: "u-chef-1",
        price: 1000,
      });

      expect(res.status).toBe(404);
    });

    it("rejects a bid on a non-Pending order with 409", async () => {
      const order = await createOrderRow(getPool(), { status: "Preparing" });

      const res = await request(app).post("/api/quotes").send({
        orderId: order.id,
        chefId: "u-chef-1",
        price: 1000,
      });

      expect(res.status).toBe(409);
    });

    it("rejects a bid on an expired order with 409", async () => {
      const order = await createOrderRow(getPool(), { expiresInSeconds: -60 });

      const res = await request(app).post("/api/quotes").send({
        orderId: order.id,
        chefId: "u-chef-1",
        price: 1000,
      });

      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/expired/i);
    });

    it("stops a customer bidding on their own request with 409", async () => {
      const order = await createOrderRow(getPool()); // owned by u-cust-1

      const res = await request(app).post("/api/quotes").send({
        orderId: order.id,
        chefId: "u-cust-1", // same uid as the order's customer
        price: 1000,
      });

      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/cannot bid on your own/i);
    });

    it("rejects invalid prices with 400", async () => {
      const order = await createOrderRow(getPool());

      const zero = await request(app).post("/api/quotes").send({
        orderId: order.id,
        chefId: "u-chef-1",
        price: 0,
      });
      expect(zero.status).toBe(400);

      const missing = await request(app).post("/api/quotes").send({
        orderId: order.id,
        chefId: "u-chef-1",
      });
      expect(missing.status).toBe(400);
    });

    it("rejects a bid from an unknown chef with a friendly 409", async () => {
      const order = await createOrderRow(getPool());

      const res = await request(app).post("/api/quotes").send({
        orderId: order.id,
        chefId: "u-chef-ghost",
        price: 1000,
      });

      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/not recognised/i);
    });
  });

  describe("quote acceptance (POST /api/orders/:id/accept)", () => {
    it("accepts the winning quote, rejects competitors and locks the order", async () => {
      const order = await createOrderRow(getPool());
      const bids = [
        { chefId: "u-chef-1", price: 3000 },
        { chefId: "u-chef-2", price: 2500 },
      ];
      const created = [];
      for (const bid of bids) {
        const r = await request(app).post("/api/quotes").send({
          orderId: order.id,
          ...bid,
        });
        expect(r.status).toBe(201);
        created.push(r.body);
      }
      const winning = created.find((q) => Number(q.price) === 2500);

      const res = await request(app)
        .post(`/api/orders/${order.id}/accept`)
        .send({ quoteId: winning.id, customerId: "u-cust-1" });

      expect(res.status).toBe(200);
      expect(res.body.orderStatus).toBe("Quoted");
      expect(res.body.chefId).toBe("u-chef-2");

      const pool = getPool();
      const statuses = await pool.query(
        "SELECT id, status FROM quotes WHERE order_id = $1",
        [order.id],
      );
      const byId = Object.fromEntries(
        statuses.rows.map((r) => [r.id, r.status]),
      );
      expect(byId[winning.id]).toBe("Accepted");
      expect(Object.values(byId).filter((s) => s === "Rejected").length).toBe(
        bids.length - 1,
      );

      const updated = await pool.query(
        "SELECT status, chef_id, total_price FROM orders WHERE id = $1",
        [order.id],
      );
      expect(updated.rows[0].status).toBe("Quoted");
      expect(updated.rows[0].chef_id).toBe("u-chef-2");
      expect(Number(updated.rows[0].total_price)).toBe(2500);
    });

    it("forbids a different customer from accepting (403)", async () => {
      const order = await createOrderRow(getPool());
      const bid = await request(app).post("/api/quotes").send({
        orderId: order.id,
        chefId: "u-chef-1",
        price: 1000,
      });

      const res = await request(app)
        .post(`/api/orders/${order.id}/accept`)
        .send({ quoteId: bid.body.id, customerId: "u-cust-2" });

      expect(res.status).toBe(403);
    });

    it("refuses acceptance when the order is no longer open (409)", async () => {
      const order = await createOrderRow(getPool(), { status: "Preparing" });
      const bid = await request(app).post("/api/quotes").send({
        orderId: order.id,
        chefId: "u-chef-1",
        price: 1000,
      });
      expect(bid.status).toBe(409); // bid itself is refused now

      const accept = await request(app)
        .post(`/api/orders/${order.id}/accept`)
        .send({ quoteId: "QT-ANY", customerId: "u-cust-1" });
      expect(accept.status).toBe(409);
    });

    it("returns 404 when the quote is not on this order", async () => {
      const order = await createOrderRow(getPool());
      const other = await createOrderRow(getPool());
      const bid = await request(app).post("/api/quotes").send({
        orderId: other.id,
        chefId: "u-chef-1",
        price: 1000,
      });

      const res = await request(app)
        .post(`/api/orders/${order.id}/accept`)
        .send({ quoteId: bid.body.id, customerId: "u-cust-1" });

      expect(res.status).toBe(404);
    });
  });

  describe("order cancellation (PATCH /api/orders/:id/cancel)", () => {
    it("cancels a Pending order and rejects all its quotes", async () => {
      const order = await createOrderRow(getPool());
      const bid = await request(app).post("/api/quotes").send({
        orderId: order.id,
        chefId: "u-chef-1",
        price: 1500,
      });
      expect(bid.status).toBe(201);

      const res = await request(app)
        .patch(`/api/orders/${order.id}/cancel`)
        .send({ customerId: "u-cust-1" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("Cancelled");

      const pool = getPool();
      const quotes = await pool.query(
        "SELECT status FROM quotes WHERE order_id = $1",
        [order.id],
      );
      expect(quotes.rows[0].status).toBe("Rejected");
    });

    it("refuses cancellation by a non-owner (403)", async () => {
      const order = await createOrderRow(getPool());

      const res = await request(app)
        .patch(`/api/orders/${order.id}/cancel`)
        .send({ customerId: "u-cust-2" });

      expect(res.status).toBe(403);
    });

    it("refuses cancellation of a non-Pending order (409)", async () => {
      const order = await createOrderRow(getPool(), { status: "Delivered" });

      const res = await request(app)
        .patch(`/api/orders/${order.id}/cancel`)
        .send({ customerId: "u-cust-1" });

      expect(res.status).toBe(409);
    });
  });

  describe("expiry sweep", () => {
    it("marks overdue Pending orders Expired and voids their quotes", async () => {
      const pool = getPool();
      // The order must be open for bidding when the quote is placed; it is
      // backdated afterwards (the quote endpoint rejects expired orders).
      const stale = await createOrderRow(getPool(), { expiresInSeconds: 3600 });
      const fresh = await createOrderRow(getPool(), { expiresInSeconds: 3600 });
      await request(app).post("/api/quotes").send({
        orderId: stale.id,
        chefId: "u-chef-1",
        price: 900,
      });
      await pool.query(
        "UPDATE orders SET expires_at = NOW() - INTERVAL '5 minutes' WHERE id = $1",
        [stale.id],
      );

      const res = await request(app).get("/api/orders/customer/u-cust-1");
      expect(res.status).toBe(200);

      const orders = await pool.query(
        "SELECT id, status FROM orders WHERE id IN ($1, $2)",
        [stale.id, fresh.id],
      );
      const byId = Object.fromEntries(orders.rows.map((r) => [r.id, r.status]));
      expect(byId[stale.id]).toBe("Expired");
      expect(byId[fresh.id]).toBe("Pending");

      const quote = await pool.query(
        "SELECT status FROM quotes WHERE order_id = $1",
        [stale.id],
      );
      expect(quote.rows[0].status).toBe("Rejected");
    });
  });

  describe("chef feed (GET /api/orders/chef/:chefId)", () => {
    it("shows open orders plus the chef's own claimed orders, and hides expired ones", async () => {
      const pool = getPool();
      const open = await createOrderRow(getPool(), { chefId: null });
      const mine = await createOrderRow(getPool(), {
        chefId: "u-chef-1",
        status: "Preparing",
      });
      const expiredOther = await createOrderRow(getPool(), {
        expiresInSeconds: -300,
      });

      const res = await request(app).get("/api/orders/chef/u-chef-1");
      expect(res.status).toBe(200);

      const ids = res.body.map((o) => o.id);
      expect(ids).toContain(open.id);
      expect(ids).toContain(mine.id);
      expect(ids).not.toContain(expiredOther.id);

      const claimed = res.body.find((o) => o.id === mine.id);
      expect(claimed.chefId).toBe("u-chef-1");
    });

    it("includes the pending quote count for open orders", async () => {
      const pool = getPool();
      const order = await createOrderRow(getPool());
      await request(app)
        .post("/api/quotes")
        .send({ orderId: order.id, chefId: "u-chef-1", price: 1000 });
      await request(app)
        .post("/api/quotes")
        .send({ orderId: order.id, chefId: "u-chef-2", price: 1200 });

      const res = await request(app).get("/api/orders/chef/u-chef-1");
      const row = res.body.find((o) => o.id === order.id);
      expect(row.quoteCount).toBe(2);
    });
  });
});
