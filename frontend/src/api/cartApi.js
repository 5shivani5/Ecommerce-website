import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8086/api/cart",
  withCredentials: true, // crucial for session persistence
});

// Get cart
const getCart = async () => {
  const res = await api.get("/");
  return res.data;
};

// Add item
const addToCart = async (product) => {
  // Make sure field names match backend CartRequestDTO
  const payload = {
      productId: product.id || product.productId,  // map your API field to backend DTO
      productName: product.name || product.productName,
      brand: product.brand || "Urban Vogue",
      imageUrl: product.imageUrl || "",
      price: product.price,
      quantity: 1,
    };

  console.log("Adding to cart payload:", payload); // debug

  const res = await api.post("/add", payload);
  return res.data;
};

// Update quantity
const updateQuantity = async (productId, qty) => {
  const res = await api.put(`/update/${productId}?quantity=${qty}`);
  return res.data;
};

// Remove item
const removeFromCart = async (productId) => {
  const res = await api.delete(`/remove/${productId}`);
  return res.data;
};

// Clear cart
const clearCart = async () => {
  const res = await api.delete("/clear");
  return res.data;
};

export default {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
};