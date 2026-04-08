import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

// ✅ MOCK navigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// ✅ Helper render
const renderNavbar = (user = null) => {
  const mockLogout = jest.fn();

  render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user, logout: mockLogout }}>
        <Navbar />
      </AuthContext.Provider>
    </BrowserRouter>
  );

  return { mockLogout };
};

// ─── Basic render ─────────────────────────────────────────────
test("renders UrbanVogue logo", () => {
  renderNavbar();
  expect(screen.getByText("UrbanVogue")).toBeInTheDocument();
});




