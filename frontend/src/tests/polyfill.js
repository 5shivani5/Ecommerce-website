// src/tests/polyfill.js
//
// This file runs via "setupFiles" — BEFORE the test framework and
// any modules load. That's why TextEncoder must live here.
//
// react-router-dom v7 uses TextEncoder internally. Jest's jsdom
// environment does not expose it as a global, so we polyfill it
// from Node's built-in 'util' module before anything else loads.

const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;