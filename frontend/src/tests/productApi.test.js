import axios from "axios";
import { getProductsByCategory, getAllProducts } from "../api/productApi";

jest.mock("axios");

const MOCK_TOKEN = "mock.jwt.token";

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("token", MOCK_TOKEN);
  jest.clearAllMocks();
});

const AUTH_HEADER = { headers: { Authorization: `Bearer ${MOCK_TOKEN}` } };

const mockProducts = [
  { id: 1, name: "Floral Dress", price: 1299 },
  { id: 2, name: "Slim Jeans", price: 2499 },
];

// ─── getProductsByCategory ────────────────────────────────────────────────────

test("getProductsByCategory calls correct URL for men (categoryId=1)", async () => {
  axios.get.mockResolvedValue({ data: mockProducts });

  const result = await getProductsByCategory("men");

  expect(axios.get).toHaveBeenCalledWith(
    "http://localhost:8082/products/category/1",
    AUTH_HEADER
  );
  expect(result).toEqual(mockProducts);
});

test("getProductsByCategory calls correct URL for women (categoryId=2)", async () => {
  axios.get.mockResolvedValue({ data: mockProducts });

  await getProductsByCategory("women");

  expect(axios.get).toHaveBeenCalledWith(
    "http://localhost:8082/products/category/2",
    AUTH_HEADER
  );
});

test("getProductsByCategory calls correct URL for kids (categoryId=3)", async () => {
  axios.get.mockResolvedValue({ data: mockProducts });

  await getProductsByCategory("kids");

  expect(axios.get).toHaveBeenCalledWith(
    "http://localhost:8082/products/category/3",
    AUTH_HEADER
  );
});

test("getProductsByCategory returns empty array when API fails", async () => {
  axios.get.mockRejectedValue(new Error("Network error"));
  const result = await getProductsByCategory("men");
  expect(result).toEqual([]);
});

// ─── getAllProducts ───────────────────────────────────────────────────────────

test("getAllProducts returns all products", async () => {
  const allProducts = [
    { id: 1, name: "Floral Dress" },
    { id: 2, name: "Slim Jeans" },
    { id: 3, name: "Kids Kurta" },
  ];
  axios.get.mockResolvedValue({ data: allProducts });

  const result = await getAllProducts();

  expect(axios.get).toHaveBeenCalledWith(
    "http://localhost:8082/products",
    AUTH_HEADER
  );
  expect(result).toHaveLength(3);
});

test("getAllProducts returns empty array when API fails", async () => {
  axios.get.mockRejectedValue(new Error("Network error"));
  const result = await getAllProducts();
  expect(result).toEqual([]);
});
