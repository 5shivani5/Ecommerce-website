import orderApi from "../api/orderApi";
import axios from "axios";

jest.mock("axios");

const MOCK_USER_ID = 101;

jest.mock("jwt-decode", () => ({
  jwtDecode: () => ({
    userId: MOCK_USER_ID,
    sub: "priya",
  }),
}));

beforeEach(() => {
  localStorage.setItem("token", "mock.token");
});

afterEach(() => {
  jest.clearAllMocks();
});

// ─── getUserOrders ─────────────────────────────────────────────
test("getUserOrders calls GET with correct userId URL", async () => {
  axios.get.mockResolvedValue({ data: [{ orderId: 1 }] });

  const result = await orderApi.getUserOrders();

  expect(axios.get).toHaveBeenCalledWith(
    `http://localhost:8085/orders/user/${MOCK_USER_ID}`,
    expect.any(Object)
  );

  expect(result).toEqual([{ orderId: 1 }]);
});

test("getUserOrders returns empty array when user has no orders", async () => {
  axios.get.mockResolvedValue({ data: [] });

  const result = await orderApi.getUserOrders();

  expect(result).toEqual([]);
});

// ─── placeOrder ─────────────────────────────────────────────
test("placeOrder POSTs correct payload shape", async () => {
  const orderData = { items: [{ price: 1000, quantity: 2 }] };

  axios.post.mockResolvedValue({ data: { orderId: 99 } });

  const result = await orderApi.placeOrder(orderData);

  expect(axios.post).toHaveBeenCalledWith(
    "http://localhost:8085/orders/place",
    expect.objectContaining({
      userId: MOCK_USER_ID,
      username: "priya",
    }),
    expect.any(Object)
  );

  expect(result).toEqual({ orderId: 99 });
});

// ─── cancelOrder ─────────────────────────────────────────────
test("cancelOrder calls PUT with correct orderId URL", async () => {
  axios.put.mockResolvedValue({ data: { status: "CANCELLED" } });

  const result = await orderApi.cancelOrder(55);

  expect(axios.put).toHaveBeenCalledWith(
    "http://localhost:8085/orders/55/cancel",
    {},
    expect.any(Object)
  );

  expect(result).toEqual({ status: "CANCELLED" });
});

test("cancelOrder throws if API call fails", async () => {
  axios.put.mockRejectedValue(new Error("Server error"));

  await expect(orderApi.cancelOrder(55)).rejects.toThrow("Server error");
});