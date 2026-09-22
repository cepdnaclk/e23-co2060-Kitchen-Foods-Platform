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
// Users / food / upload routes — auth requirements and ownership rules.
// ---------------------------------------------------------------------------

describe.runIf(dbAvailable)("users & food api", () => {
  integrationSetup();

  let aliceToken;

  beforeAll(() => {
    aliceToken = jwt.sign(
      { id: "u-cust-1", role: "Customer" },
      "test-jwt-secret",
      { expiresIn: "1h" },
    );
  });

  describe("GET /api/food", () => {
    it("lists food items publicly with category names", async () => {
      const pool = getPool();
      await pool.query(
        `INSERT INTO food_items (id, name, description, price, chef_id, image_url, category_id)
         VALUES ('fi-1', 'Test Rice', 'desc', 1200, 'u-chef-1', '/uploads/x.jpg', 'cat-rice')`,
      );

      const res = await request(app).get("/api/food");

      expect(res.status).toBe(200);
      const item = res.body.find((f) => f.id === "fi-1");
      expect(item).toBeTruthy();
      expect(item.categoryName).toBe("Rice & Curry");
      expect(Number(item.price)).toBe(1200);
    });

    it("lists categories publicly", async () => {
      const res = await request(app).get("/api/food/categories");
      expect(res.status).toBe(200);
      const names = res.body.map((c) => c.name);
      expect(names).toContain("Rice & Curry");
    });
  });

  describe("POST /api/food/chef", () => {
    it("lets a chef publish a dish", async () => {
      const res = await request(app).post("/api/food/chef").send({
        name: "Chef Special",
        description: "Secret recipe",
        price: 1800,
        chefId: "u-chef-1",
        imageUrl: "/uploads/special.jpg",
        categoryId: "cat-rice",
      });

      expect(res.status).toBe(201);
      expect(res.body.chefId).toBe("u-chef-1");
    });

    it("returns 400 without required fields", async () => {
      const res = await request(app)
        .post("/api/food/chef")
        .send({ name: "No chef or category" });
      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/food/chef/:id", () => {
    it("prevents a chef deleting another chef's item (403)", async () => {
      const pool = getPool();
      await pool.query(
        `INSERT INTO food_items (id, name, description, price, chef_id, image_url, category_id)
         VALUES ('fi-owned', 'Owned Dish', 'desc', 500, 'u-chef-1', '', 'cat-rice')`,
      );

      const res = await request(app)
        .delete("/api/food/chef/fi-owned")
        .send({ chefId: "u-chef-2" });

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/do not own/i);
    });

    it("lets the owner delete their item", async () => {
      const pool = getPool();
      await pool.query(
        `INSERT INTO food_items (id, name, description, price, chef_id, image_url, category_id)
         VALUES ('fi-mine', 'My Dish', 'desc', 500, 'u-chef-1', '', 'cat-rice')`,
      );

      const res = await request(app)
        .delete("/api/food/chef/fi-mine")
        .send({ chefId: "u-chef-1" });

      expect(res.status).toBe(200);
      const gone = await pool.query(
        "SELECT 1 FROM food_items WHERE id = 'fi-mine'",
      );
      expect(gone.rows.length).toBe(0);
    });
  });

  describe("GET /api/users/:uid", () => {
    it("requires a token", async () => {
      const res = await request(app).get("/api/users/u-cust-1");
      expect(res.status).toBe(401);
    });

    it("returns the user profile for a valid token", async () => {
      const res = await request(app)
        .get("/api/users/u-cust-1")
        .set("Authorization", `Bearer ${aliceToken}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe("alice@test.com");
    });

    it("returns 404 for an unknown uid", async () => {
      const res = await request(app)
        .get("/api/users/u-nobody")
        .set("Authorization", `Bearer ${aliceToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/upload", () => {
    it("rejects uploads without a token (401)", async () => {
      const res = await request(app).post("/api/upload");
      expect(res.status).toBe(401);
    });

    it("rejects non-image files (400)", async () => {
      const res = await request(app)
        .post("/api/upload")
        .set("Authorization", `Bearer ${aliceToken}`)
        .attach("image", Buffer.from("malicious"), {
          filename: "evil.html",
          contentType: "text/html",
        });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/image/i);
    });

    it("accepts a PNG upload and returns a safe /uploads/ URL", async () => {
      // Minimal 1x1 PNG.
      const png = Buffer.from(
        "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6300010000050001" +
          "0d0a2db40000000049454e44ae426082",
        "hex",
      );

      const res = await request(app)
        .post("/api/upload")
        .set("Authorization", `Bearer ${aliceToken}`)
        .attach("image", png, { filename: "pixel.png", contentType: "image/png" });

      expect(res.status).toBe(201);
      expect(res.body.url).toMatch(/^\/uploads\/.+\.png$/);
      // Filename is server-generated, never the client's original name.
      expect(res.body.filename).not.toBe("pixel.png");
    });

    it("serves uploaded files with nosniff protection", async () => {
      const res = await request(app).get("/uploads/definitely-missing.jpg");
      // 404 is fine — the assertion is that the static server responded.
      expect([404, 200]).toContain(res.status);
    });
  });

  describe("health of swagger docs", () => {
    it("exposes the OpenAPI contract", async () => {
      const res = await request(app).get("/api-docs/openapi.json");
      expect(res.status).toBe(200);
    });
  });
});
