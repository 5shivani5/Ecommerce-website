import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/background.png";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    categoryId: "",
    name: "",
    brand: "",
    description: "",
    price: "",
    stock: "",
    material: "",
    imagePath: "",
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // 'success' | 'error'

  //  Fetch product with JWT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await axios.get(`http://localhost:8082/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProduct(res.data);
      } catch (err) {
        console.error(err);
        setStatusMessage(" Failed to load product (check your login/role)");
        setStatusType("error");
      }
    };

    fetchProduct();
  }, [id]);

  //  Handle input changes
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
    setStatusMessage(""); // clear previous message
  };

  //  Update product with JWT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.put(`http://localhost:8082/products/${id}`, product, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatusMessage(" Product updated successfully!");
      setStatusType("success");

      // Optional: navigate after 2 seconds
      // setTimeout(() => navigate("/manage-products"), 2000);
    } catch (err) {
      console.error(err);
      setStatusMessage(" Update failed. Please check your role or try again.");
      setStatusType("error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Edit Product</h1>

        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          style={styles.input}
        />

        <input
          name="brand"
          value={product.brand}
          onChange={handleChange}
          placeholder="Brand"
          style={styles.input}
        />

        <select
          name="categoryId"
          value={product.categoryId}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Category</option>
          <option value="1">Men</option>
          <option value="2">Women</option>
          <option value="3">Kids</option>
        </select>

        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          style={styles.textarea}
        />

        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
          style={styles.input}
        />

        <input
          type="number"
          name="stock"
          value={product.stock}
          onChange={handleChange}
          placeholder="Stock Quantity"
          style={styles.input}
        />

        <input
          name="material"
          value={product.material}
          onChange={handleChange}
          placeholder="Material"
          style={styles.input}
        />

        <input
          name="imagePath"
          value={product.imagePath}
          onChange={handleChange}
          placeholder="Image URL"
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Update Product
        </button>

        <button
          type="button"
          style={styles.backButton}
          onClick={() => navigate("/manage-products")}
        >
          Back
        </button>

        {statusMessage && (
          <div
            style={{
              marginTop: "15px",
              textAlign: "center",
              fontWeight: "bold",
              color: statusType === "success" ? "#4BB543" : "#FF4C4C",
            }}
          >
            {statusMessage}
          </div>
        )}
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    overflowY: "auto",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    position: "relative",
    fontFamily: "'Georgia', serif",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  form: {
    position: "relative",
    zIndex: 1,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    backdropFilter: "blur(12px)",
    padding: "40px",
    width: "380px",
    margin: "60px auto",
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
  },
  textarea: {
    padding: "11px",
    minHeight: "70px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    outline: "none",
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
};

export default EditProduct;
