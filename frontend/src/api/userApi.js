import axios from "axios";
//  Base URL (includes /api)
const BASE_URL = "http://localhost:8084/api";

//  Axios instance
export const api = axios.create({
  baseURL: BASE_URL,
});

//  Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// ================= AUTH APIs =================

//  REGISTER
export const registerUser = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  return response.data;
};

//  LOGIN
export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);

  //  STORE TOKEN HERE
  localStorage.setItem("token", response.data.token);

  return response.data;
};


// ================= ADMIN APIs =================

//  GET USERS
export const getUsers = async (keyword = "") => {
  const response = await api.get(`/admin/users?keyword=${keyword}`);
  return response.data;
};

//  TOGGLE USER (enable/disable)
export const toggleUser = async (id) => {
  const response = await api.put(`/admin/users/${id}/toggle`);
  return response.data;
};

//  CHANGE ROLE
export const changeUserRole = async (id, role) => {
  const response = await api.put(`/admin/users/${id}/role?role=${role}`);
  return response.data;
};

//  DELETE USER
export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};
