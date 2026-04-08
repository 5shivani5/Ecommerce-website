// src/tests/setupTests.js
//
// This file runs via "setupFilesAfterEnv" — AFTER jest-circus loads.
// Good place for @testing-library/jest-dom which extends Jest's
// expect() with DOM matchers like toBeInTheDocument(), toHaveValue() etc.

import "@testing-library/jest-dom";
jest.spyOn(console, "error").mockImplementation(() => {});