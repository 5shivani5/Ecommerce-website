import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={styles.navbar}>
      <h2 style={styles.logo}>UrbanVogue</h2>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    background: "black",
    color: "white",
  },
  button: {
    padding: "6px 12px",
    cursor: "pointer",
  },
};

export default Navbar;