import { describe, it, expect, beforeEach, vi } from "vitest";
import jwt from "jsonwebtoken";

// ---------------------------------------------------------------------------
// Middlewares: verifyToken, adminOnly, errorHandler.
// req/res are minimal fakes — no HTTP server needed.
// ---------------------------------------------------------------------------

const SECRET = "test-jwt-secret";

describe("verifyToken middleware", () => {
  let verifyToken;

  beforeEach(async () => {
    process.env.JWT_SECRET = SECRET;
    ({ verifyToken } = await import("../../src/middlewares/auth.middleware.js"));
  });

  const makeRes = () => {
    const res = { statusCode: null, body: null };
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (payload) => {
      res.body = payload;
      return res;
    };
    return res;
  };

  it("returns 401 when no Authorization header is present", () => {
    const req = { headers: {} };
    const res = makeRes();
    const next = vi.fn();

    verifyToken(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("No token provided");
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 for an invalid token", () => {
    const req = { headers: { authorization: "Bearer not.a.jwt" } };
    const res = makeRes();
    const next = vi.fn();

    verifyToken(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Invalid token");
    expect(next).not.toHaveBeenCalled();
  });

  it("reports 'Token expired' for an expired token", () => {
    const token = jwt.sign({ id: "u1", role: "Customer" }, SECRET, {
      expiresIn: "-10s",
    });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = makeRes();
    const next = vi.fn();

    verifyToken(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Token expired");
  });

  it("decodes a valid token into req.user and calls next", () => {
    const token = jwt.sign({ id: "u-chef-1", role: "Chef" }, SECRET, {
      expiresIn: "1h",
    });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = makeRes();
    const next = vi.fn();

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toMatchObject({ id: "u-chef-1", role: "Chef" });
  });
});

describe("adminOnly middleware", () => {
  let adminOnly;

  beforeEach(async () => {
    ({ default: adminOnly } = await import(
      "../../src/middlewares/admin.middleware.js"
    ));
  });

  it("allows requests from an Admin", () => {
    const req = { user: { role: "Admin" } };
    const next = vi.fn();

    adminOnly(req, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects non-admin roles with 403", () => {
    const req = { user: { role: "Customer" } };
    const res = { statusCode: null, body: null };
    res.status = (c) => {
      res.statusCode = c;
      return res;
    };
    res.json = (p) => {
      res.body = p;
      return res;
    };
    const next = vi.fn();

    adminOnly(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("errorHandler middleware", () => {
  let errorHandler;

  beforeEach(async () => {
    ({ errorHandler } = await import(
      "../../src/middlewares/errorHandler.js"
    ));
  });

  const makeRes = () => {
    const res = { statusCode: null, body: null, headers: {} };
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (payload) => {
      res.body = payload;
      return res;
    };
    res.setHeader = (k, v) => {
      res.headers[k] = v;
    };
    return res;
  };

  it("defaults to 500 and hides the internal message", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = makeRes();

    errorHandler(new Error("db password leaked"), {}, res, () => {});

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Something went wrong");
    expect(res.body.error).toBe("db password leaked");
    spy.mockRestore();
  });

  it("passes through statusCode and message for 4xx errors", () => {
    const err = new Error("This order is no longer open for bidding");
    err.statusCode = 409;
    const res = makeRes();

    errorHandler(err, {}, res, () => {});

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("This order is no longer open for bidding");
  });
});
