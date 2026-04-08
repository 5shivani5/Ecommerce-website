import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import bgImage from "../assets/background.png";
const STATUS_META = {
  PLACED:    { color: "#facc15", bg: "rgba(250,204,21,0.12)" },
  TRANSIT:   { color: "#38bdf8", bg: "rgba(56,189,248,0.12)" },
  DELIVERED: { color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  CANCELLED: { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
const getStatusColor = (status) => {
  switch (status) {
    case "PLACED":
      return "#e3f2fd"; // Light Blue
    case "TRANSIT":
      return "#fff3e0"; // Light Orange
    case "DELIVERED":
      return "#e8f5e9"; // Light Green
    case "CANCELLED":
      return "#ffebee"; // Light Red
    default:
      return "#ffffff";
  }
};
  const loadOrders = async () => {
    try {
      const data = await adminApi.getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await adminApi.updateOrderStatus(id, status);
      loadOrders();
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <div style={s.container}>
      <div style={s.overlay} />

      <div style={s.content}>
<h1 style={{ ...s.title, color: "white" }}>
  ORDERS LIST
</h1>
        {loading && <p style={s.info}>Loading orders…</p>}

        {!loading && orders.length === 0 && (
          <div style={s.emptyBox}>
            <p style={{ fontSize: 40 }}>📦</p>
            <p style={{ color: "#aaa" }}>No orders found.</p>
          </div>
        )}

        {!loading && orders.map((order) => {
          const meta = STATUS_META[order.status] || STATUS_META.PLACED;

          return (
            <div key={order.id} style={{ ...s.card, borderColor: `${meta.color}44` }}>

              {/* Header */}
              <div style={s.header}>
                <div>
                  <p style={s.orderId}>Order #{order.id}</p>
                  <p style={s.meta}>
<p style={s.meta}>
  ₹{order.totalAmount} · {order.username}
</p>                  </p>
                </div>

                <span style={{
                  ...s.badge,
                  color: meta.color,
                  borderColor: meta.color,
                  background: meta.bg
                }}>
                  {order.status}
                </span>
              </div>

              {/* Address */}
              <p style={s.address}>
                📍 {order.addressLine}, {order.city}, {order.state} — {order.pincode}
              </p>

              {/* Items */}
              <div style={s.itemsBox}>
                {order.items?.map((item, i) => (
                  <div key={i} style={s.itemRow}>
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt="" style={s.img} />
                      : <div style={s.imgPlaceholder}>👗</div>
                    }
                    <div style={{ flex: 1 }}>
                      <p style={s.itemName}>{item.productName}</p>
                      <p style={s.itemMeta}>
                        {item.brand} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p style={s.price}>₹{item.subtotal}</p>
                  </div>
                ))}
              </div>

              {/* Status Change */}
              <div style={s.footer}>
                <span style={s.label}>Update Status:</span>

               <select
                 value={order.status}
                 onChange={(e) => handleStatusChange(order.id, e.target.value)}
                 style={{
                   ...s.select, // Keep your existing styles
                   backgroundColor: getStatusColor(order.status), // Dynamically update BG
                   color: "#333", // Ensure text remains readable
                   fontWeight: "bold",
                   cursor: "pointer"
                 }}
               >
                 {order.status === "PLACED" && (
                   <>
                     <option value="PLACED">PLACED</option>
                     <option value="TRANSIT">TRANSIT</option>
                     <option value="CANCELLED">CANCELLED</option>
                   </>
                 )}

                 {order.status === "TRANSIT" && (
                   <>
                     <option value="TRANSIT">TRANSIT</option>
                     <option value="DELIVERED">DELIVERED</option>
                   </>
                 )}

                 {order.status === "DELIVERED" && (
                   <option value="DELIVERED">DELIVERED</option>
                 )}

                 {order.status === "CANCELLED" && (
                   <option value="CANCELLED">CANCELLED</option>
                 )}
               </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  container: {
    height: "100vh",              // 🔥 important (not minHeight)
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    position: "relative",
    fontFamily: "Georgia",
    overflow: "hidden",           // 🔥 prevent full page scroll
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
  },
  content: {
    position: "relative",
    zIndex: 1,
    padding: "80px 32px",
    maxWidth: 860,
    margin: "0 auto",
    color: "#fff",
  paddingBottom: "120px",   // 🔥 ADD THIS
boxSizing: "border-box",
    height: "100vh",              // 🔥 full height
    overflowY: "auto",

                 scrollbarWidth: "none",// 🔥 scroll only content
  },
select: {
  padding: "6px 10px",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 4,
  fontFamily: "Georgia",
  cursor: "pointer",
},

option: {
  backgroundColor: "#111",   // 🔥 dark background
  color: "#fff",
},
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    letterSpacing: 2,
  },
  info: { color: "#aaa" },
  emptyBox: {
    textAlign: "center",
    padding: 40,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 10,
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    backdropFilter: "blur(10px)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  orderId: { fontWeight: "bold", fontSize: 15 },
  meta: { fontSize: 12, color: "#aaa" },

  badge: {
    border: "1px solid",
    padding: "4px 10px",
    fontSize: 11,
    borderRadius: 4,
    letterSpacing: 1,
  },

  address: {
    fontSize: 12,
    color: "#777",
    marginBottom: 12,
  },

  itemsBox: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    marginTop: 10,
    paddingTop: 10,
  },

  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 0",
  },

  img: {
    width: 45,
    height: 45,
    objectFit: "cover",
    borderRadius: 6,
  },

  imgPlaceholder: {
    width: 45,
    height: 45,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.08)",
    borderRadius: 6,
  },

  itemName: { fontSize: 13 },
  itemMeta: { fontSize: 11, color: "#777" },
  price: { fontSize: 13, fontWeight: "bold" },

  footer: {
    marginTop: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: { fontSize: 12, color: "#aaa" },

  select: {
    padding: "6px 10px",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 4,
    fontFamily: "Georgia",
    cursor: "pointer",
  },
};