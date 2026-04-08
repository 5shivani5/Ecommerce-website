import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8083/payment";

//  COMMON AUTH HEADER
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

//  GET USER FROM TOKEN
const getUser = () => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("No token found");

  const decoded = jwtDecode(token);

  return {
    userId: decoded.userId,
    username: decoded.sub,
  };
};

const paymentApi = {

  //  GET WALLET BALANCE
  getWalletBalance: async () => {
    const { userId } = getUser();

    const res = await axios.get(
      `${BASE_URL}/balance/${userId}`,
      getAuthHeaders()
    );

    return res.data;
  },

  //  MAKE PAYMENT (CORRECTED)
  makePayment: async (amount, orderId) => {
    const { userId } = getUser();

    const res = await axios.post(
      `${BASE_URL}/pay`,
      null,
      {
        params: {
          userId,     //  FIXED (was username ❌)
          amount,
          orderId,    //  dynamic (not hardcoded)
        },
        ...getAuthHeaders(), //  include JWT
      }
    );

    return res.data;
  },

  // ADMIN: ADD MONEY
  addMoneyToUser: async (userId, amount) => {
    const res = await axios.post(
      `${BASE_URL}/add`,
      null,
      {
        params: {
          userId,
          amount,
        },
        ...getAuthHeaders(),
      }
    );

    return res.data;
  },
};

export default paymentApi;
