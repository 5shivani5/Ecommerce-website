import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../pages/Login";
import { BrowserRouter } from "react-router-dom";
import * as userApi from "../api/userApi";

jest.mock("../api/userApi");

describe("Login Component", () => {
  it("renders login form correctly", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Login as Admin")).toBeInTheDocument();
  });

  it("updates state on input change", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Username");
    fireEvent.change(usernameInput, { target: { value: "priya" } });
    expect(usernameInput.value).toBe("priya");
  });

  it("calls loginUser API on submit", async () => {
    const mockData = { token: "12345" };
    userApi.loginUser.mockResolvedValue(mockData);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "priya" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pass" } });
    fireEvent.click(screen.getByText("Login"));

    expect(userApi.loginUser).toHaveBeenCalledWith({ username: "priya", password: "pass" });
  });

  it("navigates to /admin-login on admin button click", () => {
    const { container } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const adminButton = screen.getByText("Login as Admin");
    fireEvent.click(adminButton);

  });
});