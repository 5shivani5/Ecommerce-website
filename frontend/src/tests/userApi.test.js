// ✅ STEP 1: Mock axios FIRST (top of file)
jest.mock("axios", () => {
  const mockAxiosInstance = {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
    },
  };

  return {
    create: jest.fn(() => mockAxiosInstance),
  };
});

// ✅ STEP 2: Now import AFTER mock
import {
  registerUser,
  loginUser,
  getUsers,
  toggleUser,
  changeUserRole,
  deleteUser,
} from "../api/userApi";

import axios from "axios";

// Access mocked instance
const api = axios.create();

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

// ─── TESTS ─────────────────────────────

test("registerUser calls correct API", async () => {
  api.post.mockResolvedValue({ data: { message: "Registered" } });

  const result = await registerUser({ username: "test" });

  expect(api.post).toHaveBeenCalledWith("/auth/signup", {
    username: "test",
  });

  expect(result).toEqual({ message: "Registered" });
});

test("loginUser stores token", async () => {
  api.post.mockResolvedValue({ data: { token: "abc123" } });

  const result = await loginUser({ username: "test" });

  expect(localStorage.getItem("token")).toBe("abc123");
  expect(result).toEqual({ token: "abc123" });
});

test("getUsers calls correct API", async () => {
  api.get.mockResolvedValue({ data: [] });

  await getUsers("abc");

  expect(api.get).toHaveBeenCalledWith("/admin/users?keyword=abc");
});

test("toggleUser calls correct API", async () => {
  api.put.mockResolvedValue({ data: {} });

  await toggleUser(5);

  expect(api.put).toHaveBeenCalledWith("/admin/users/5/toggle");
});

test("changeUserRole calls correct API", async () => {
  api.put.mockResolvedValue({ data: {} });

  await changeUserRole(5, "ADMIN");

  expect(api.put).toHaveBeenCalledWith(
    "/admin/users/5/role?role=ADMIN"
  );
});

test("deleteUser calls correct API", async () => {
  api.delete.mockResolvedValue({ data: {} });

  await deleteUser(5);

  expect(api.delete).toHaveBeenCalledWith("/admin/users/5");
});