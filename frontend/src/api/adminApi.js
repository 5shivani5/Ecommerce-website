import axios from "axios";

const BASE_URL = "http://localhost:8085/admin";

const adminApi = {

  //  GET ALL ORDERS (WITH TOKEN )
  getAllOrders: async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  },

  //  UPDATE ORDER STATUS (WITH TOKEN )
  updateOrderStatus: async (orderId, status) => {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `${BASE_URL}/orders/${orderId}/status`,
      null,
      {
        params: { status },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  },
};

export default adminApi;
