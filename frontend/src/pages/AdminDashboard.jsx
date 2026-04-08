import { useNavigate } from "react-router-dom";
import bgImage from "../assets/background.png";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      <div style={styles.content}>
        {/* Top Bar */}
        <div style={styles.topBar}>
          <h2 style={styles.title}>Admin Dashboard</h2>


          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>

        </div>
<h3>Welcome Back,Admin!!</h3>
        {/* Cards */}
        <div style={styles.cardContainer}>
          <div style={styles.card} onClick={() => navigate("/add-product")}>
            <h3>Add Product</h3>
            <p>Create new products</p>
          </div>

          <div style={styles.card} onClick={() => navigate("/manage-products")}>
            <h3>Manage Products</h3>
            <p>Edit / Delete products</p>
          </div>

          <div style={styles.card} onClick={() => navigate("/add-category")}>
            <h3>Add Category</h3>
            <p>Create new categories</p>
          </div>

          <div style={styles.card} onClick={() => navigate("/manage-categories")}>
            <h3>Manage Categories</h3>
            <p>Edit / Delete categories</p>
          </div>

          <div style={styles.card} onClick={() => navigate("/admin/users")}>
            <h3>View Users</h3>
            <p>Manage users</p>
          </div>

          <div style={styles.card} onClick={() => navigate("/admin/orders")}>
            <h3>Orders</h3>
            <p>Track customer orders</p>
          </div>

          <div style={styles.card} onClick={() => navigate("/wallet")}>
            <h3>Manage Wallet</h3>
            <p>Add money to users</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
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

  content: {
    position: "relative",
    zIndex: 1,
    padding: "40px",
    color: "#fff",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },

  title: {
    fontSize: "26px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "white",
  },

  logoutBtn: {
    padding: "10px 16px",
    border: "1px solid #fff",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    letterSpacing: "1px",
  },

  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    padding: "25px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default AdminDashboard;