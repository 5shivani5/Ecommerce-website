import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/background.png";

function AddCategory() {
  const navigate = useNavigate();

  const [category, setCategory] = useState({ name: "" });
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // 'success' | 'error'

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8082/categories", category, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setStatusMessage("✅ Category added successfully!");
      setStatusType("success");
      setCategory({ name: "" }); // clear input
      // Optional: navigate after a delay if desired
      // setTimeout(() => navigate("/admin"), 2000);

    } catch (err) {
      console.error(err);
      setStatusMessage("❌ Failed to add category");
      setStatusType("error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Add Category</h1>

        <input
          name="name"
          placeholder="Category Name"
          value={category.name}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#fff";
            e.target.style.color = "#000";
          }}
        >
          Add Category
        </button>

        <button
          type="button"
          style={styles.backButton}
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>

        {/* ✅ Display status message */}
        {statusMessage && (
          <div
            style={{
              textAlign: "center",
              marginTop: "15px",
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Georgia', serif",
    position: "relative",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  overlay: {
    position: "absolute",
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
    width: "360px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    borderRadius: "4px",
  },

  title: {
    textAlign: "center",
    color: "#fff",
    marginBottom: "10px",
    textTransform: "uppercase",
    fontSize: "22px",
  },

  input: {
    padding: "12px",
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
  },
};

export default AddCategory;