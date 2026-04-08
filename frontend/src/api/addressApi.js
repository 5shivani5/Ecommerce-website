import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8084/api/address";

// ✅ Get userId from token
const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token");
  return jwtDecode(token).userId;
};

// ✅ Get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const addressApi = {
  // ✅ Get all saved addresses
  getAddresses: async () => {
    const userId = getUserId();

    const res = await axios.get(
      `${BASE_URL}/${userId}`,
      getAuthHeaders()
    );

    return res.data;
  },

  // ✅ Add a new address
  addAddress: async (addressData) => {
    const userId = getUserId();

    const res = await axios.post(
      `${BASE_URL}/${userId}`,
      addressData,
      getAuthHeaders()
    );

    return res.data;
  },

  // ✅ Set default address
  setDefault: async (addressId) => {
    const userId = getUserId();

    const res = await axios.put(
      `${BASE_URL}/${userId}/${addressId}/default`,
      {},
      getAuthHeaders()
    );

    return res.data;
  },

  // ✅ Delete address
  deleteAddress: async (addressId) => {
    const userId = getUserId();

    await axios.delete(
      `${BASE_URL}/${userId}/${addressId}`,
      getAuthHeaders()
    );
  },
};

export default addressApi;