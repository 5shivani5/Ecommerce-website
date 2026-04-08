import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../pages/Register";
import * as userApi from "../api/userApi";
import { AuthContext } from "../context/AuthContext";

//Mocks
jest.mock("../api/userApi");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock window.alert (Register uses alert() for errors)
window.alert = jest.fn();

// ── Helper: renders Register with a fake AuthContext
const mockLogin = jest.fn();
const renderRegister = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ login: mockLogin, logout: jest.fn(), token: null }}>
        <Register />
      </AuthContext.Provider>
    </MemoryRouter>
  );

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});


test("renders the register form with all elements", () => {
  renderRegister();

  expect(screen.getByText("Urban Vogue Apparels")).toBeInTheDocument();
  expect(screen.getByText("Create your account")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  expect(screen.getByText("Sign in")).toBeInTheDocument();
  expect(screen.getByText("← Back to Home")).toBeInTheDocument();
});



test("updates username field when user types", () => {
  renderRegister();
  const input = screen.getByPlaceholderText("Username");

  fireEvent.change(input, { target: { value: "priya" } });

  expect(input.value).toBe("priya");
});

test("updates password field when user types", () => {
  renderRegister();
  const input = screen.getByPlaceholderText("Password");

  fireEvent.change(input, { target: { value: "pass123" } });

  expect(input.value).toBe("pass123");
});

test("updates confirm password field when user types", () => {
  renderRegister();
  const input = screen.getByPlaceholderText("Confirm Password");

  fireEvent.change(input, { target: { value: "pass123" } });

  expect(input.value).toBe("pass123");
});



test("shows alert when passwords do not match", async () => {
  renderRegister();

  fireEvent.change(screen.getByPlaceholderText("Username"), {
    target: { value: "priya" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "pass123" },
  });
  fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
    target: { value: "different" },
  });
  fireEvent.click(screen.getByRole("button", { name: /register/i }));

  expect(window.alert).toHaveBeenCalledWith("Passwords do not match");
});

test("does not call API when passwords do not match", async () => {
  renderRegister();

  fireEvent.change(screen.getByPlaceholderText("Username"), {
    target: { value: "priya" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "pass123" },
  });
  fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
    target: { value: "different" },
  });
  fireEvent.click(screen.getByRole("button", { name: /register/i }));

  // API must never be called if frontend validation fails
  expect(userApi.registerUser).not.toHaveBeenCalled();
});



test("calls registerUser API with correct data on valid submit", async () => {
  userApi.registerUser.mockResolvedValue({ token: "mock.jwt.token" });

  renderRegister();

  fireEvent.change(screen.getByPlaceholderText("Username"), {
    target: { value: "priya" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "pass123" },
  });
  fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
    target: { value: "pass123" },
  });
  fireEvent.click(screen.getByRole("button", { name: /register/i }));

  await waitFor(() => {
    expect(userApi.registerUser).toHaveBeenCalledWith({
      username: "priya",
      password: "pass123",
      confirmPassword: "pass123",
    });
  });
});

test("calls login() from AuthContext with token after successful registration", async () => {
  userApi.registerUser.mockResolvedValue({ token: "mock.jwt.token" });

  renderRegister();

  fireEvent.change(screen.getByPlaceholderText("Username"), {
    target: { value: "priya" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "pass123" },
  });
  fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
    target: { value: "pass123" },
  });
  fireEvent.click(screen.getByRole("button", { name: /register/i }));

  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith("mock.jwt.token");
  });
});


test("shows alert when registration API fails", async () => {
  userApi.registerUser.mockRejectedValue({
    response: { data: { message: "Username already exists" } },
  });

  renderRegister();

  fireEvent.change(screen.getByPlaceholderText("Username"), {
    target: { value: "priya" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "pass123" },
  });
  fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
    target: { value: "pass123" },
  });
  fireEvent.click(screen.getByRole("button", { name: /register/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Username already exists");
  });
});