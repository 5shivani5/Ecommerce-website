import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/background.png";
import paymentApi from "../api/paymentApi";

export default function AdminWallet() {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // "success" | "error"

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !amount) {
      setStatusMessage(" Please fill all fields");
      setStatusType("error");
      return;
    }

    try {
      await paymentApi.addMoneyToUser(userId, amount);
      setStatusMessage(` ₹${amount} added to user ${userId}`);
      setStatusType("success");
      setUserId("");
      setAmount("");
    } catch (err) {
      console.error(err);
      setStatusMessage(err.response?.data || " Failed to add money");
      setStatusType("error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>ADD MONEY</h1>

        {statusMessage && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "12px",
              color: statusType === "success" ? "#4BB543" : "#FF4C4C",
              fontWeight: "bold",
            }}
          >
            {statusMessage}
          </div>
        )}

        <input
          type="number"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
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
          Add Money
        </button>

        <button
          type="button"
          style={styles.backButton}
          onClick={() => navigate("/admin")}
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
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    backdropFilter: "blur(12px)",
    padding: "40px",
    width: "350px",
    margin: "100px auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    borderRadius: "4px",
  },

  title: {
    textAlign: "center",
    color: "#fff",
    marginBottom: "15px",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },

  input: {
    padding: "11px",
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
