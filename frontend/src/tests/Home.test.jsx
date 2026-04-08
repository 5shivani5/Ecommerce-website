import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../pages/Home";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});


test("renders brand title and tagline", () => {
  renderHome();

  expect(screen.getByText("Urban Vogue Apparels")).toBeInTheDocument();
  expect(screen.getByText("Where Style Meets Street")).toBeInTheDocument();
  expect(screen.getByText("Elevate Your Everyday Look")).toBeInTheDocument();
});

test("renders Get Started button", () => {
  renderHome();

  expect(screen.getByRole("button", { name: /get started/i })).toBeInTheDocument();
});

test("does NOT show Logout button when user is not logged in", () => {
  // localStorage is empty — no token
  renderHome();

  expect(screen.queryByRole("button", { name: /logout/i })).not.toBeInTheDocument();
});

test("shows Logout button when user is logged in", () => {
  // Set a token to simulate logged-in state
  localStorage.setItem("token", "mock.jwt.token");

  renderHome();

  expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
});

test("navigates to /login when Get Started is clicked", () => {
  renderHome();

  fireEvent.click(screen.getByRole("button", { name: /get started/i }));

  expect(mockNavigate).toHaveBeenCalledWith("/login");
});

test("clears localStorage and navigates to /login when Logout is clicked", () => {
  localStorage.setItem("token", "mock.jwt.token");
  localStorage.setItem("username", "priya");

  renderHome();

  fireEvent.click(screen.getByRole("button", { name: /logout/i }));

  expect(localStorage.getItem("token")).toBeNull();
  expect(localStorage.getItem("username")).toBeNull();
  expect(mockNavigate).toHaveBeenCalledWith("/login");
});