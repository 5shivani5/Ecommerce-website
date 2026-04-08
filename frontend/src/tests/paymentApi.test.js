import paymentApi from "../api/paymentApi";
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

// ─── getWalletBalance ─────────────────────────────────────────────
test("getWalletBalance calls GET with correct userId URL", async () => {
  axios.get.mockResolvedValue({ data: { balance: 5000 } });

  const result = await paymentApi.getWalletBalance();

  expect(axios.get).toHaveBeenCalledWith(
    `http://localhost:8083/payment/balance/${MOCK_USER_ID}`,
    expect.any(Object)
  );

  expect(result).toEqual({ balance: 5000 });
});

test("getWalletBalance throws if no token", async () => {
  localStorage.removeItem("token");

  await expect(paymentApi.getWalletBalance()).rejects.toThrow();
});

// ─── makePayment ─────────────────────────────────────────────
test("makePayment calls POST with correct params", async () => {
  axios.post.mockResolvedValue({ data: { success: true } });

  const result = await paymentApi.makePayment(1299, 101);

  expect(axios.post).toHaveBeenCalledWith(
    "http://localhost:8083/payment/pay",
    null,
    expect.objectContaining({
      params: {
        userId: MOCK_USER_ID,
        amount: 1299,
        orderId: 101,
      },
    })
  );

  expect(result).toEqual({ success: true });
});

test("makePayment throws if API fails", async () => {
  axios.post.mockRejectedValue(new Error("Payment failed"));

  await expect(paymentApi.makePayment(1299, 101)).rejects.toThrow("Payment failed");
});