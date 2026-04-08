import {
  setToken,
  getToken,
  removeToken,
} from "../utils/tokenStorage";

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});


test("setToken saves token to localStorage", () => {
  setToken("my.jwt.token");
  expect(localStorage.getItem("token")).toBe("my.jwt.token");
});

test("getToken retrieves token from localStorage", () => {
  localStorage.setItem("token", "my.jwt.token");
  expect(getToken()).toBe("my.jwt.token");
});

test("getToken returns null when no token is set", () => {
  expect(getToken()).toBeNull();
});

test("removeToken deletes token from localStorage", () => {
  localStorage.setItem("token", "my.jwt.token");
  removeToken();
  expect(localStorage.getItem("token")).toBeNull();
});

test("setToken overwrites existing token", () => {
  setToken("old.token");
  setToken("new.token");
  expect(getToken()).toBe("new.token");
});
