import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/background.png";

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    categoryId: "",
    description: "",
    price: "",
    stock: "",
    material: "",
    imagePath: "",
  });

  // New state for status message
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
    setStatusMessage(""); // Clear message when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8082/products", product, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setStatusMessage("✅ Product added successfully!");
      // Optional: navigate after 2 seconds
      // setTimeout(() => navigate("/admin"), 2000);
    } catch (err) {
      console.error(err);
      setStatusMessage("❌ Failed to add product. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      <div style={styles.scrollContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h1 style={styles.title}>Add Product</h1>

          <input
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="brand"
            placeholder="Brand"
            value={product.brand}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <select
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Category</option>
            <option value="1">Men</option>
            <option value="2">Women</option>
            <option value="3">Kids</option>
          </select>

          <textarea
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
            style={styles.textarea}
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={product.stock}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="material"
            placeholder="Material"
            value={product.material}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="imagePath"
            placeholder="Image URL"
            value={product.imagePath}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Add Product
          </button>

          <button
            type="button"
            style={styles.backButton}
            onClick={() => navigate("/admin")}
          >
            Back to Dashboard
          </button>

          {/* Display status message */}
          {statusMessage && (
            <div style={styles.statusMessage}>{statusMessage}</div>
          )}
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    overflowY: "auto",
    fontFamily: "'Georgia', serif",
    position: "relative",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
    zIndex: 0,
  },

  scrollContainer: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px",
    minHeight: "100%",
  },

  form: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    backdropFilter: "blur(12px)",
    padding: "40px",
    width: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    borderRadius: "4px",
  },

  title: {
    textAlign: "center",
    color: "#fff",
    marginBottom: "15px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    fontSize: "22px",
  },

  input: {
    padding: "11px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    outline: "none",
    fontSize: "14px",
    appearance: "none",
    backgroundColor: "rgba(30, 30, 30, 0.9)",
  },

  textarea: {
    padding: "11px",
    minHeight: "70px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    outline: "none",
    fontSize: "14px",
  },

  button: {
    padding: "12px",
    border: "1px solid #fff",
    background: "#fff",
    color: "#000",
    cursor: "pointer",
    marginTop: "10px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    transition: "all 0.3s ease",
  },

  backButton: {
    padding: "10px",
    border: "1px solid #aaa",
    background: "transparent",
    color: "#aaa",
    cursor: "pointer",
    marginTop: "5px",
  },

  statusMessage: {
    marginTop: "15px",
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
};

export default AddProduct;