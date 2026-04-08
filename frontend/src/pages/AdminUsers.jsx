import { useEffect, useState } from "react";
import { getUsers, toggleUser, changeUserRole, deleteUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/background.png";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await getUsers(keyword);
      setUsers(res.content);
    } catch (err) {
      console.error(err);
      alert("Access denied or error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggle = async (id) => {
    await toggleUser(id);
    fetchUsers();
  };

  const handleRoleChange = async (id, role) => {
    await changeUserRole(id, role.toUpperCase());
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      <div style={styles.content}>
        {/* Header */}
        <div style={styles.topBar}>
          <h2 style={styles.title}>Manage Users</h2>
          <button style={styles.backBtn} onClick={() => navigate("/admin")}>
            Back
          </button>
        </div>

        {/* Search */}
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search users..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={styles.input}
          />
          <button style={styles.searchBtn} onClick={fetchUsers}>
            Search
          </button>
        </div>

        {/* Table */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.enabled ? "Active" : "Disabled"}</td>

                  <td style={styles.actions}>
                    <button onClick={() => handleToggle(user.id)} style={styles.btn}>
                      Toggle
                    </button>

                    <button
                      onClick={() => handleRoleChange(user.id, "ADMIN")}
                      style={styles.btn}
                    >
                      Make Admin
                    </button>

                    <button
                      onClick={() => handleRoleChange(user.id, "USER")}
                      style={styles.btn}
                    >
                      Make User
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    marginBottom: "20px",
  },

  title: {
    fontSize: "24px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "white",
  },

  backBtn: {
    padding: "8px 14px",
    border: "1px solid #fff",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
  },

  searchBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    padding: "10px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#fff",
    outline: "none",
  },

  searchBtn: {
    padding: "10px 16px",
    border: "1px solid #fff",
    background: "#fff",
    color: "#000",
    cursor: "pointer",
  },

  tableWrapper: {
    overflowX: "auto",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    color: "#fff",
    textAlign: "center", // ✅ CENTER ALL TEXT
  },

  actions: {
    display: "flex",
    justifyContent: "center", // ✅ CENTER HORIZONTALLY
    alignItems: "center",     // ✅ CENTER VERTICALLY
    gap: "6px",
    flexWrap: "wrap",
  },

  btn: {
    padding: "6px 10px",
    border: "1px solid #fff",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "6px 10px",
    border: "1px solid red",
    background: "transparent",
    color: "red",
    cursor: "pointer",
  },
};