import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import {
  dbAvailable,
  integrationSetup,
  getPool,
} from "../setup/integration.js";

// ---------------------------------------------------------------------------
// Auth API — registration, login, chef approval gating, JWT round-trip.
// ---------------------------------------------------------------------------

describe.runIf(dbAvailable)("auth api", () => {
  integrationSetup();

  beforeAll(() => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
  });

  describe("POST /api/auth/register", () => {
    it("registers a customer", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          full_name: "Test Customer",
          email: "reg-customer@test.com",
          password: "password123",
          role: "Customer",
        });

      expect(res.status).toBe(201);
      expect(res.body.user.email).toBe("reg-customer@test.com");
      expect(res.body.user.role).toBe("Customer");
    });

    it("registers a chef in the Pending approval state", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          full_name: "New Chef",
          email: "reg-chef@test.com",
          password: "password123",
          role: "Chef",
        });

      expect(res.status).toBe(201);
      expect(res.body.user.approval_status).toBe("Pending");
      expect(res.body.message).toMatch(/approv/i);
    });

    it("rejects duplicate emails", async () => {
      await request(app).post("/api/auth/register").send({
        full_name: "Dup",
        email: "dup@test.com",
        password: "password123",
        role: "Customer",
      });

      const res = await request(app).post("/api/auth/register").send({
        full_name: "Dup Again",
        email: "dup@test.com",
        password: "password123",
        role: "Customer",
      });

      expect(res.status).toBe(500);
    });
  });

  describe("POST /api/auth/login", () => {
    it("logs in a customer and returns a usable JWT", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "alice@test.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeTruthy();
      expect(res.body.user.role).toBe("Customer");

      const decoded = jwt.verify(res.body.token, "test-jwt-secret");
      expect(decoded.id).toBe("u-cust-1");
      expect(decoded.role).toBe("Customer");

      // The token grants access to protected user routes.
      const me = await request(app)
        .get(`/api/users/${decoded.id}`)
        .set("Authorization", `Bearer ${res.body.token}`);
      expect(me.status).toBe(200);
      expect(me.body.email).toBe("alice@test.com");
    });

    it("rejects a wrong password with 401", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "alice@test.com", password: "wrong-password" });

      expect(res.status).toBe(401);
    });

    it("rejects an unknown email with 401", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "nobody@test.com", password: "password123" });

      expect(res.status).toBe(401);
    });

    it("blocks a Pending chef with 403 and an approval message", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "pending@test.com",
        password: "password123",
      });

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/awaiting admin approval/i);
    });

    it("allows an Approved chef to log in", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "ranjan@test.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.user.role).toBe("Chef");
      expect(res.body.user.approval_status).toBe("Approved");
    });
  });

  it("rejects protected routes without a token", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(401);
  });

  it("rejects protected routes with an invalid token", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", "Bearer garbage");
    expect(res.status).toBe(403);
  });

  it("persists a registered Rejected chef correctly via admin approval", async () => {
    const pool = getPool();
    // Register a fresh chef, then reject them as an admin would.
    await request(app).post("/api/auth/register").send({
      full_name: "Rejectable Chef",
      email: "rejectable@test.com",
      password: "password123",
      role: "Chef",
    });

    const adminToken = jwt.sign(
      { id: "u-admin-1", role: "Admin" },
      "test-jwt-secret",
      { expiresIn: "1h" },
    );

    const chef = await pool.query(
      "SELECT uid FROM chefs WHERE email = 'rejectable@test.com'",
    );
    const uid = chef.rows[0].uid;

    const rejected = await request(app)
      .patch(`/api/admin/chefs/${uid}/approval`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "Rejected" });
    expect(rejected.status).toBe(200);
    expect(rejected.body.approval_status).toBe("Rejected");

    const login = await request(app).post("/api/auth/login").send({
      email: "rejectable@test.com",
      password: "password123",
    });
    expect(login.status).toBe(403);
    expect(login.body.error).toMatch(/rejected/i);
  });
});
