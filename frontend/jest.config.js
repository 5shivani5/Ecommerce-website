// jest.config.js — place in ecom-frontend/ root
export default {
  testEnvironment: "jsdom",
  verbose: true,
  // setupFiles runs BEFORE the test framework loads
  // TextEncoder polyfill MUST go here — not in setupFilesAfterEnv
  // because react-router-dom needs it at module load time
  setupFiles: ["./src/tests/polyfill.js"],

  // setupFilesAfterEnv is the CORRECT Jest key (not setupFilesAfterFramework/EachEach)
  // This runs AFTER jest-circus loads — good for @testing-library/jest-dom matchers
  setupFilesAfterEnv: ["./src/tests/setupTests.js"],

  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/tests/__mocks__/fileMock.js",
  },

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  testMatch: ["**/tests/**/*.test.{js,jsx}"],
};