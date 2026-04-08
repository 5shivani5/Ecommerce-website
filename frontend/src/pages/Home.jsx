import { useNavigate } from "react-router-dom";
import bgImage from "../assets/background.png";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      <div style={styles.header}>
        <span style={styles.logo} onClick={() => navigate("/")}>

        </span>

        {!token ? (
          <button
            style={styles.logoutBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        ) : (
          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>Urban Vogue Apparels</h1>
        <p style={styles.tagline}>Where Style Meets Street</p>

        <div style={styles.hero}>
          <h2 style={styles.heroText}>Elevate Your Everyday Look</h2>

          <button
            style={styles.ctaButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#000";
              e.target.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#fff";
              e.target.style.color = "#000";
            }}
            onClick={() => {
              if (token) {
                navigate("/products");
              } else {
                navigate("/login");
              }
            }}
          >
Get Started          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Georgia', serif",
    position: "relative",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    overflow: "hidden",

  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    zIndex: 0,
  },
 header: {
   position: "absolute",
   top: 0,
   left: 0,
   right: 0,
   height: "60px",              // ✅ FIXED HEIGHT
   display: "flex",
   justifyContent: "flex-end",
   alignItems: "center",        // ✅ vertical alignment
   padding: "0 40px",
   zIndex: 2,
 },
  logo: {
    color: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
    letterSpacing: "4px",
    cursor: "pointer",
  },

  content: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "20px",
    marginTop: "-80px",
  },
  title: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: "2px",
    marginBottom: "20px",
    textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
  },
  tagline: {
    fontSize: "16px",
    color: "#cccccc",
    letterSpacing: "3px",
    textTransform: "uppercase",
    marginBottom: "50px",

  },
  hero: {
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255,255,255,0.25)",
    backdropFilter: "blur(10px)",
    color: "white",
    padding: "40px 50px",
    borderRadius: "4px",
    width: "340px",
    margin: "0 auto",
  },
  heroText: {
    fontSize: "22px",
    fontWeight: "400",
    letterSpacing: "1px",
    marginBottom: "24px",
    color: "#f0f0f0",
  },
  ctaButton: {
    padding: "12px 20px",        // ✅ FIX (not 12px 0)
    fontSize: "14px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    backgroundColor: "#ffffff",
    color: "#000000",
    border: "1px solid #fff",
    borderRadius: "2px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "'Georgia', serif",
  },
logoutBtn: {
  padding: "8px 16px",         // ✅ match Login button
  fontSize: "13px",
  background: "#fff",
  color: "#000",
  border: "1px solid #fff",
  borderRadius: "2px",
  cursor: "pointer",
  fontFamily: "'Georgia', serif",
  display: "inline-block",     // ✅ prevents weird stretching
},
};

export default Home;