import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/background.png";

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState({ name: "" });
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // "success" | "error"

  // ✅ Fetch category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`http://localhost:8082/categories/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCategory(res.data);
      } catch (err) {
        console.error(err);
        setStatusMessage("❌ Failed to load category");
        setStatusType("error");
      }
    };
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    setCategory({ ...category, name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8082/categories/${id}`, category, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStatusMessage("✅ Category updated successfully!");
      setStatusType("success");
    } catch (err) {
      console.error(err);
      setStatusMessage(err.response?.data || "❌ Update failed");
      setStatusType("error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Edit Category</h1>

        {statusMessage && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "15px",
              color: statusType === "success" ? "#4BB543" : "#FF4C4C",
              fontWeight: "bold",
            }}
          >
            {statusMessage}
          </div>
        )}

        <input
          name="name"
          value={category.name}
          onChange={handleChange}
          placeholder="Category Name"
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Update
        </button>

        <button
          type="button"
          style={styles.backButton}
          onClick={() => navigate("/manage-categories")}
        >
          Back
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    fontFamily: "'Georgia', serif",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  form: {
    position: "relative",
    zIndex: 1,
    padding: "40px",
    width: "360px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    borderRadius: "4px",
  },

  title: {
    color: "#fff",
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: "22px",
  },

  input: {
    padding: "12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#fff",
    outline: "none",
  },

  button: {
    padding: "12px",
    background: "#fff",
    color: "#000",
    border: "none",
    cursor: "pointer",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },

  backButton: {
    padding: "10px",
    background: "transparent",
    border: "1px solid #aaa",
    color: "#aaa",
    cursor: "pointer",
  },
};

export default EditCategory;