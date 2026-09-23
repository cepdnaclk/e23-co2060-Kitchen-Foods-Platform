import { describe, it, expect, beforeEach, vi } from "vitest";
import bcrypt from "bcrypt";

// ---------------------------------------------------------------------------
// Controller unit tests — models and services are mocked so no DB needed.
// Each controller is imported AFTER its module mocks are registered.
// ---------------------------------------------------------------------------

const makeRes = () => {
  const res = { statusCode: 200, body: undefined };
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

describe("order.controller", () => {
  let Order;
  let Quote;
  let pool;
  let controllers;

  beforeEach(async () => {
    vi.resetModules();

    Order = {
      create: vi.fn(),
      claimOrder: vi.fn(),
      findByChefId: vi.fn(),
      findByCustomerId: vi.fn(),
      updateStatus: vi.fn(),
      cancelOrder: vi.fn(),
      expireOverdue: vi.fn(),
    };
    Quote = { acceptQuote: vi.fn() };
    pool = { query: vi.fn() };

    vi.doMock("../../src/models/order.model.js", () => ({ default: Order }));
    vi.doMock("../../src/models/quote.model.js", () => ({ default: Quote }));
    vi.doMock("../../src/config/db.js", () => ({ default: pool }));

    controllers = await import("../../src/controllers/order.controller.js");
  });

  describe("createOrder", () => {
    it("returns 400 when customerId is missing", async () => {
      const res = makeRes();
      await controllers.createOrder({ body: {} }, res, vi.fn());

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Customer ID is required");
      expect(Order.create).not.toHaveBeenCalled();
    });

    it("returns 400 when the customer does not exist in users table", async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const res = makeRes();

      await controllers.createOrder(
        { body: { customerId: "ghost" } },
        res,
        vi.fn(),
      );

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/Customer account not found/);
      expect(Order.create).not.toHaveBeenCalled();
    });

    it("creates the order and returns 201 on success", async () => {
      pool.query.mockResolvedValue({ rows: [{ uid: "u-cust-1" }] });
      const order = { id: "ORD-1" };
      Order.create.mockResolvedValue(order);

      const body = { customerId: "u-cust-1", mealDescription: "x" };
      const res = makeRes();
      await controllers.createOrder({ body }, res, vi.fn());

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(order);
      expect(Order.create).toHaveBeenCalledWith(
        expect.objectContaining({ customerId: "u-cust-1" }),
      );
    });
  });

  describe("claimOrder", () => {
    it("returns 400 when chefId is missing", async () => {
      const res = makeRes();
      await controllers.claimOrder(
        { params: { orderId: "ORD-1" }, body: {} },
        res,
        vi.fn(),
      );

      expect(res.statusCode).toBe(400);
    });

    it("returns 409 when the order is already claimed or missing", async () => {
      Order.claimOrder.mockResolvedValue(null);
      const res = makeRes();

      await controllers.claimOrder(
        { params: { orderId: "ORD-1" }, body: { chefId: "u-chef-1" } },
        res,
        vi.fn(),
      );

      expect(res.statusCode).toBe(409);
    });

    it("returns the claimed order on success", async () => {
      const order = { id: "ORD-1", status: "Preparing" };
      Order.claimOrder.mockResolvedValue(order);
      const res = makeRes();

      await controllers.claimOrder(
        { params: { orderId: "ORD-1" }, body: { chefId: "u-chef-1" } },
        res,
        vi.fn(),
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(order);
    });
  });

  describe("getChefOrders / getCustomerOrders", () => {
    it("runs the lazy expiry sweep before reading the chef feed", async () => {
      Order.expireOverdue.mockResolvedValue(0);
      Order.findByChefId.mockResolvedValue([]);
      const res = makeRes();

      await controllers.getChefOrders(
        { params: { chefId: "u-chef-1" } },
        res,
        vi.fn(),
      );

      expect(Order.expireOverdue).toHaveBeenCalledTimes(1);
      expect(res.body).toEqual([]);
    });

    it("runs the lazy expiry sweep before reading the customer feed", async () => {
      Order.expireOverdue.mockResolvedValue(2);
      Order.findByCustomerId.mockResolvedValue([{ id: "ORD-9" }]);
      const res = makeRes();

      await controllers.getCustomerOrders(
        { params: { customerId: "u-cust-1" } },
        res,
        vi.fn(),
      );

      expect(Order.expireOverdue).toHaveBeenCalledTimes(1);
      expect(res.body).toEqual([{ id: "ORD-9" }]);
    });
  });

  describe("updateOrderStatus", () => {
    it("returns 404 when the order does not exist", async () => {
      Order.updateStatus.mockResolvedValue(null);
      const res = makeRes();

      await controllers.updateOrderStatus(
        { params: { orderId: "nope" }, body: { status: "Ready" } },
        res,
        vi.fn(),
      );

      expect(res.statusCode).toBe(404);
    });

    it("updates and returns the order", async () => {
      const order = { id: "ORD-1", status: "Ready" };
      Order.updateStatus.mockResolvedValue(order);
      const res = makeRes();

      await controllers.updateOrderStatus(
        { params: { orderId: "ORD-1" }, body: { status: "Ready" } },
        res,
        vi.fn(),
      );

      expect(res.body).toEqual(order);
    });
  });

  describe("acceptQuote", () => {
    it("returns 400 when quoteId/customerId missing", async () => {
      const res = makeRes();
      await controllers.acceptQuote(
        { params: { orderId: "ORD-1" }, body: {} },
        res,
        vi.fn(),
      );

      expect(res.statusCode).toBe(400);
    });

    it("delegates to Quote.acceptQuote", async () => {
      Quote.acceptQuote.mockResolvedValue({ orderStatus: "Quoted" });
      const res = makeRes();

      await controllers.acceptQuote(
        {
          params: { orderId: "ORD-1" },
          body: { quoteId: "QT-1", customerId: "u-cust-1" },
        },
        res,
        vi.fn(),
      );

      expect(Quote.acceptQuote).toHaveBeenCalledWith({
        orderId: "ORD-1",
        quoteId: "QT-1",
        customerId: "u-cust-1",
      });
      expect(res.body.orderStatus).toBe("Quoted");
    });
  });

  describe("cancelOrder", () => {
    it("returns 400 when customerId missing", async () => {
      const res = makeRes();
      await controllers.cancelOrder(
        { params: { orderId: "ORD-1" }, body: {} },
        res,
        vi.fn(),
      );

      expect(res.statusCode).toBe(400);
    });

    it("returns the cancelled order", async () => {
      const order = { id: "ORD-1", status: "Cancelled" };
      Order.cancelOrder.mockResolvedValue(order);
      const res = makeRes();

      await controllers.cancelOrder(
        { params: { orderId: "ORD-1" }, body: { customerId: "u-cust-1" } },
        res,
        vi.fn(),
      );

      expect(res.body).toEqual(order);
    });
  });
});

describe("admin.controller", () => {
  let adminService;
  let userService;
  let controller;

  beforeEach(async () => {
    vi.resetModules();

    // adminLogin bcrypt-compares credentials before the role check, so the
    // comparison must succeed for the non-admin (403) branch to be reached.
    vi.doMock("bcrypt", async (importOriginal) => {
      const actual = await importOriginal();
      return { ...actual, compare: vi.fn().mockResolvedValue(true) };
    });
    adminService = {
      getStatsService: vi.fn(),
      getDashboardOverviewService: vi.fn(),
      getUsersService: vi.fn(),
      createUserByAdminService: vi.fn(),
      updateUserByAdminService: vi.fn(),
      removeUserByAdminService: vi.fn(),
      updateChefApprovalService: vi.fn(),
      getFoodService: vi.fn(),
      addFoodService: vi.fn(),
      updateFoodService: vi.fn(),
      removeFoodService: vi.fn(),
      getOrdersService: vi.fn(),
      updateOrderStatusService: vi.fn(),
      deleteOrderService: vi.fn(),
    };
    userService = {
      getUserByEmailService: vi.fn().mockResolvedValue(null),
    };

    vi.doMock("../../src/services/admin.service.js", () => adminService);
    vi.doMock("../../src/services/user.service.js", () => userService);

    controller = (await import("../../src/controllers/admin.controller.js"))
      .default;
  });

  describe("adminLogin", () => {
    it("returns 400 when email or password missing", async () => {
      const res = makeRes();
      await controller.adminLogin({ body: { email: "a@b.c" } }, res, vi.fn());

      expect(res.statusCode).toBe(400);
    });

    it("returns 401 for an unknown email", async () => {
      const res = makeRes();
      await controller.adminLogin(
        { body: { email: "ghost@x.com", password: "pw" } },
        res,
        vi.fn(),
      );

      expect(res.statusCode).toBe(401);
    });

    it("returns 403 when credentials belong to a non-admin", async () => {
      const hash = await bcrypt.hash("pw", 10);
      userService.getUserByEmailService.mockResolvedValue({
        uid: "u-chef-1",
        role: "Chef",
        password_hash: hash,
      });
      const res = makeRes();

      await controller.adminLogin(
        { body: { email: "ranjan@test.com", password: "pw" } },
        res,
        vi.fn(),
      );

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toMatch(/Admin privileges required/);
    });
  });

  describe("createUser", () => {
    it("returns 400 when required fields are missing", async () => {
      const res = makeRes();
      await controller.createUser(
        { body: { full_name: "X", email: "x@x.com" } },
        res,
        vi.fn(),
      );

      expect(res.statusCode).toBe(400);
    });

    it("maps EMAIL_EXISTS to 409", async () => {
      const err = new Error("Email already exists");
      err.code = "EMAIL_EXISTS";
      adminService.createUserByAdminService.mockRejectedValue(err);

      const res = makeRes();
      await controller.createUser(
        {
          body: {
            full_name: "X",
            email: "x@x.com",
            password: "pw",
            role: "Customer",
          },
        },
        res,
        vi.fn(),
      );

      expect(res.statusCode).toBe(409);
    });
  });

  describe("updateChefApproval", () => {
    it("returns 400 when status missing", async () => {
      const res = makeRes();
      await controller.updateChefApproval(
        { params: { id: "u-chef-3" }, body: {} },
        res,
        vi.fn(),
      );

      expect(res.statusCode).toBe(400);
    });

    it("returns 404 when chef not found", async () => {
      adminService.updateChefApprovalService.mockResolvedValue(null);
      const res = makeRes();

      await controller.updateChefApproval(
        { params: { id: "u-chef-3" }, body: { status: "Approved" } },
        res,
        vi.fn(),
      );

      expect(res.statusCode).toBe(404);
    });
  });

  describe("updateOrderStatus", () => {
    it("propagates validation errors as their status code", async () => {
      const err = new Error("Invalid order status");
      err.statusCode = 400;
      adminService.updateOrderStatusService.mockRejectedValue(err);

      const res = makeRes();
      await controller.updateOrderStatus(
        { params: { id: "ORD-1" }, body: { status: "Bogus" } },
        res,
        vi.fn(),
      );

      expect(res.statusCode).toBe(400);
    });
  });

  describe("addFood", () => {
    it("returns 400 when required fields missing", async () => {
      const res = makeRes();
      await controller.addFood(
        { body: { name: "Dish" } },
        res,
        vi.fn(),
      );

      expect(res.statusCode).toBe(400);
      expect(adminService.addFoodService).not.toHaveBeenCalled();
    });
  });
});
