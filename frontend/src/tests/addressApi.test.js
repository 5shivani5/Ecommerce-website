import addressApi from "../api/addressApi";
import axios from "axios";

jest.mock("axios");

const MOCK_USER_ID = 101;

//  Mock jwtDecode
jest.mock("jwt-decode", () => ({
  jwtDecode: () => ({ userId: MOCK_USER_ID }),
}));

beforeEach(() => {
  localStorage.setItem("token", "mock.token");
});

afterEach(() => {
  jest.clearAllMocks();
});

// ─── getAddresses ─────────────────────────────────────────────
test("getAddresses calls GET with correct userId URL", async () => {
  axios.get.mockResolvedValue({ data: [{ id: 1, street: "123 MG Road" }] });

  const result = await addressApi.getAddresses();

  expect(axios.get).toHaveBeenCalledWith(
    `http://localhost:8084/api/address/${MOCK_USER_ID}`,
    expect.any(Object)
  );

  expect(result).toEqual([{ id: 1, street: "123 MG Road" }]);
});

test("getAddresses throws if no token in localStorage", async () => {
  localStorage.removeItem("token");

  await expect(addressApi.getAddresses()).rejects.toThrow();
});

// ─── addAddress ─────────────────────────────────────────────
test("addAddress calls POST with userId and addressData", async () => {
  const newAddress = { street: "Anna Nagar" };

  axios.post.mockResolvedValue({ data: { id: 2, ...newAddress } });

  const result = await addressApi.addAddress(newAddress);

  expect(axios.post).toHaveBeenCalledWith(
    `http://localhost:8084/api/address/${MOCK_USER_ID}`,
    newAddress,
    expect.any(Object)
  );

  expect(result).toEqual({ id: 2, street: "Anna Nagar" });
});

// ─── setDefault ─────────────────────────────────────────────
test("setDefault calls PUT with correct userId and addressId", async () => {
  axios.put.mockResolvedValue({ data: { id: 5, isDefault: true } });

  const result = await addressApi.setDefault(5);

  expect(axios.put).toHaveBeenCalledWith(
    `http://localhost:8084/api/address/${MOCK_USER_ID}/5/default`,
    {},
    expect.any(Object)
  );

  expect(result).toEqual({ id: 5, isDefault: true });
});

// ─── deleteAddress ─────────────────────────────────────────────
test("deleteAddress calls DELETE with correct userId and addressId", async () => {
  axios.delete.mockResolvedValue({});

  await addressApi.deleteAddress(7);

  expect(axios.delete).toHaveBeenCalledWith(
    `http://localhost:8084/api/address/${MOCK_USER_ID}/7`,
    expect.any(Object)
  );
});

test("deleteAddress does not return any data", async () => {
  axios.delete.mockResolvedValue({});

  const result = await addressApi.deleteAddress(7);

  expect(result).toBeUndefined();
});
