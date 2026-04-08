import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/userApi";
import bgImage from "../assets/background.png";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({ username, password });

      console.log("Admin login response:", data);

      // ✅ Role check (if backend sends role)
      if (data.role && data.role !== "ADMIN") {
        alert("Access denied: Not an admin");
        return;
      }

      // ✅ Store token
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);

      // ✅ Navigate to admin dashboard
      navigate("/admin");

    } catch (err) {
      console.error(err);
      alert("Admin login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      <form onSubmit={handleAdminLogin} style={styles.form}>
        <h1 style={styles.mainTitle}>Urban Vogue Apparels</h1>
        <p style={styles.subtitle}>Admin Login</p>

        <input
          type="text"
          placeholder="Enter Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          Login as Admin
        </button>

        <p style={styles.bottomText}>
          <span
            style={styles.link}
            onClick={() => navigate("/login")}
          >
            ← Back to User Login
          </span>
        </p>
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
    backgroundRepeat: "no-repeat",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.60)",
    zIndex: 0,
  },
  form: {
    position: "relative",
    zIndex: 1,
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.2)",
    backdropFilter: "blur(12px)",
    padding: "40px 36px",
    width: "340px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    borderRadius: "4px",
  },
  mainTitle: {
    textAlign: "center",
    margin: "0",
    fontSize: "24px",
    color: "#fff",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "6px",
    color: "#aaa",
    fontSize: "13px",
    letterSpacing: "1px",
  },
  input: {
    padding: "11px 14px",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    fontFamily: "'Georgia', serif",
    borderRadius: "2px",
  },
  button: {
    padding: "12px",
    border: "1px solid #fff",
    background: "#fff",
    color: "#000",
    cursor: "pointer",
    fontSize: "14px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontFamily: "'Georgia', serif",
    transition: "all 0.3s ease",
    borderRadius: "2px",
    marginTop: "10px",
  },
  bottomText: {
    textAlign: "center",
    fontSize: "13px",
    color: "#aaa",
    marginTop: "5px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default AdminLogin;