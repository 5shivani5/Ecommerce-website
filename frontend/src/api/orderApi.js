import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8085/orders";

const getUserDetails = () => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  return {
    userId: decoded.userId,
    username: decoded.sub,
  };
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const orderApi = {
  // ✅ PLACE ORDER
  placeOrder: async (orderData) => {
    const { userId, username } = getUserDetails();

    const res = await axios.post(
      `${BASE_URL}/place`,
      {
        ...orderData,
        userId,
        username,
      },
      getAuthHeaders()
    );

    return res.data;
  },

  // ✅ 🔥 ADD THIS (MAIN FIX)
  getUserOrders: async () => {
    const { userId } = getUserDetails();

    const res = await axios.get(
      `${BASE_URL}/user/${userId}`, // <-- adjust if your backend path differs
      getAuthHeaders()
    );

    return res.data;
  },

  // ✅ OPTIONAL (you already use this in Orders.jsx)
 cancelOrder: async (orderId) => {
   const res = await axios.put(
     `${BASE_URL}/${orderId}/cancel`,   // ✅ FIXED ORDER
     {},
     getAuthHeaders()
   );
   return res.data;
 },


};

export default orderApi;