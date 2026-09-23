import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import {
  dbAvailable,
  integrationSetup,
  getPool,
} from "../setup/integration.js";
import { createFoodItem, createOrderRow } from "../setup/db.js";

// ---------------------------------------------------------------------------
// Admin API — RBAC, dashboard stats, chef approval, food CRUD, order
// moderation. Tokens are minted directly (login itself is covered in
// auth.api.test.js).
// ---------------------------------------------------------------------------

describe.runIf(dbAvailable)("admin api", () => {
  integrationSetup();

  let adminToken;
  let chefToken;

  beforeAll(() => {
    adminToken = jwt.sign(
      { id: "u-admin-1", role: "Admin" },
      "test-jwt-secret",
      { expiresIn: "1h" },
    );
    chefToken = jwt.sign({ id: "u-chef-1", role: "Chef" }, "test-jwt-secret", {
      expiresIn: "1h",
    });
  });

  describe("RBAC", () => {
    it("rejects admin routes without a token (401)", async () => {
      const res = await request(app).get("/api/admin/stats");
      expect(res.status).toBe(401);
    });

    it("rejects admin routes for non-admin roles (403)", async () => {
      const res = await request(app)
        .get("/api/admin/stats")
        .set("Authorization", `Bearer ${chefToken}`);
      expect(res.status).toBe(403);
    });

    it("allows admin login via /api/admin/auth/login", async () => {
      const res = await request(app).post("/api/admin/auth/login").send({
        email: "admin@test.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.user.role).toBe("Admin");
      expect(res.body.token).toBeTruthy();
    });

    it("blocks non-admin accounts from admin login (403)", async () => {
      const res = await request(app).post("/api/admin/auth/login").send({
        email: "alice@test.com",
        password: "password123",
      });
      expect(res.status).toBe(403);
    });
  });

  describe("dashboard", () => {
    it("returns counts after seeding data", async () => {
      const pool = getPool();
      await createFoodItem(pool);
      await createOrderRow(pool);

      const res = await request(app)
        .get("/api/admin/stats")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.totalUsers).toBeGreaterThanOrEqual(2);
      expect(res.body.activeChefs).toBeGreaterThanOrEqual(3);
      expect(res.body.totalFoodItems).toBeGreaterThanOrEqual(1);
      expect(res.body.totalOrders).toBeGreaterThanOrEqual(1);
    });

    it("returns dashboard overview with recent activities", async () => {
      const res = await request(app)
        .get("/api/admin/dashboard/overview")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.stats).toBeTruthy();
      expect(Array.isArray(res.body.activities)).toBe(true);
    });
  });

  describe("chef approval", () => {
    it("approves a Pending chef, who can then log in", async () => {
      const pool = getPool();
      const chef = await pool.query(
        "SELECT uid FROM chefs WHERE email = 'pending@test.com'",
      );
      const uid = chef.rows[0].uid;

      const res = await request(app)
        .patch(`/api/admin/chefs/${uid}/approval`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "Approved" });

      expect(res.status).toBe(200);
      expect(res.body.approval_status).toBe("Approved");

      const login = await request(app).post("/api/auth/login").send({
        email: "pending@test.com",
        password: "password123",
      });
      expect(login.status).toBe(200);
    });

    it("rejects invalid approval statuses (400)", async () => {
      const res = await request(app)
        .patch("/api/admin/chefs/u-chef-3/approval")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "Maybe" });
      expect(res.status).toBe(400);
    });

    it("returns 404 for an unknown chef", async () => {
      const res = await request(app)
        .patch("/api/admin/chefs/u-ghost/approval")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "Approved" });
      expect(res.status).toBe(404);
    });
  });

  describe("food management", () => {
    it("adds, updates and deletes a food item", async () => {
      const added = await request(app)
        .post("/api/admin/food")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Kottu",
          description: "Chopped roti stir fry",
          price: 950,
          chefId: "u-chef-1",
          imageUrl: "/uploads/kottu.jpg",
          categoryId: "cat-rice",
        });
      expect(added.status).toBe(201);
      expect(added.body.categoryName).toBe("Rice & Curry");

      const updated = await request(app)
        .put(`/api/admin/food/${added.body.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Chicken Kottu",
          description: "With chicken",
          price: 1100,
          chefId: "u-chef-1",
          imageUrl: "/uploads/kottu.jpg",
          categoryId: "cat-rice",
        });
      expect(updated.status).toBe(200);
      expect(updated.body.name).toBe("Chicken Kottu");

      const removed = await request(app)
        .delete(`/api/admin/food/${added.body.id}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(removed.status).toBe(200);
    });

    it("returns 400 when required food fields are missing", async () => {
      const res = await request(app)
        .post("/api/admin/food")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Incomplete" });
      expect(res.status).toBe(400);
    });

    it("returns 404 when updating a missing food item", async () => {
      const res = await request(app)
        .put("/api/admin/food/nope")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "X",
          description: "x",
          price: 1,
          chefId: "u-chef-1",
          imageUrl: "",
          categoryId: "cat-rice",
        });
      expect(res.status).toBe(404);
    });
  });

  describe("order moderation", () => {
    it("lists orders with customer names", async () => {
      const pool = getPool();
      await createOrderRow(pool, { customerId: "u-cust-2" });

      const res = await request(app)
        .get("/api/admin/orders")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0]).toHaveProperty("customer");
    });

    it("updates an order status and rejects invalid ones", async () => {
      const pool = getPool();
      const order = await createOrderRow(pool);

      const ok = await request(app)
        .patch(`/api/admin/orders/${order.id}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "Preparing" });
      expect(ok.status).toBe(200);
      expect(ok.body.status).toBe("Preparing");

      const bad = await request(app)
        .patch(`/api/admin/orders/${order.id}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "Flying" });
      expect(bad.status).toBe(400);
    });

    it("deletes an order and returns 404 the second time", async () => {
      const pool = getPool();
      const order = await createOrderRow(pool);

      const first = await request(app)
        .delete(`/api/admin/orders/${order.id}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(first.status).toBe(200);

      const second = await request(app)
        .delete(`/api/admin/orders/${order.id}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(second.status).toBe(404);
    });
  });

  describe("user management", () => {
    it("creates a user and enforces unique emails", async () => {
      const created = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          full_name: "Admin Made",
          email: "admin-made@test.com",
          password: "password123",
          role: "Customer",
        });
      expect(created.status).toBe(201);

      const dupe = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          full_name: "Admin Made 2",
          email: "admin-made@test.com",
          password: "password123",
          role: "Customer",
        });
      expect(dupe.status).toBe(409);
    });

    it("updates and deletes a user", async () => {
      const pool = getPool();
      const created = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          full_name: "Temp User",
          email: "temp-user@test.com",
          password: "password123",
          role: "Customer",
        });
      const uid = created.body.uid;

      const updated = await request(app)
        .put(`/api/admin/users/${uid}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ full_name: "Renamed User", email: "temp-user@test.com", role: "Customer" });
      expect(updated.status).toBe(200);
      expect(updated.body.full_name).toBe("Renamed User");

      const removed = await request(app)
        .delete(`/api/admin/users/${uid}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(removed.status).toBe(200);
    });
  });
});
