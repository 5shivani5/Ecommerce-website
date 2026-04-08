import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import bgImage from "../assets/background.png";

const fmt = (n) =>
  Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const STATUS_META = {
  PLACED:    { color: "#facc15", bg: "rgba(250,204,21,0.12)",  label: "Placed", step: 0 },
  TRANSIT:   { color: "#38bdf8", bg: "rgba(56,189,248,0.12)",  label: "Transit", step: 1 },
  DELIVERED: { color: "#22c55e", bg: "rgba(34,197,94,0.12)",   label: "Delivered", step: 2 },
  CANCELLED: { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   label: "Cancelled", step: -1 },
};

const STEPS = ["Placed", "Transit", "Delivered"];
function StatusTracker({ status }) {
  const meta = STATUS_META[status] || STATUS_META.PLACED;
  if (status === "CANCELLED") {
    return (
      <div style={t.wrap}>
        <span style={{ color: "#ef4444", fontSize: 13, letterSpacing: 1 }}>✖ Order Cancelled</span>
      </div>
    );
  }
  return (
    <div style={t.wrap}>
      {STEPS.map((label, i) => {
        const done   = i <= meta.step;
        const active = i === meta.step;
        return (
          <div key={label} style={t.stepGroup}>
            <div style={{
              ...t.dot,
              background:  done ? meta.color : "rgba(255,255,255,0.15)",
              border:      `2px solid ${done ? meta.color : "rgba(255,255,255,0.2)"}`,
              boxShadow:   active ? `0 0 8px ${meta.color}` : "none",
            }} />
            <span style={{ ...t.label, color: done ? meta.color : "#555", fontWeight: active ? "bold" : "normal" }}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div style={{ ...t.line, background: i < meta.step ? meta.color : "rgba(255,255,255,0.1)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const t = {
  wrap:      { display: "flex", alignItems: "flex-start", margin: "14px 0 4px" },
  stepGroup: { display: "flex", flexDirection: "column", alignItems: "center", position: "relative", flex: 1 },
  dot:       { width: 14, height: 14, borderRadius: "50%", flexShrink: 0, transition: "all 0.3s" },
  label:     { fontSize: 10, marginTop: 5, letterSpacing: 0.5, textTransform: "uppercase", textAlign: "center" },
  line:      { position: "absolute", top: 7, left: "calc(50% + 8px)", width: "calc(100% - 16px)", height: 2 },
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [expanded, setExpanded] = useState({});
  const [filter, setFilter]     = useState("ALL");
  const [cancelling, setCancelling] = useState(null);
  const [toast, setToast]       = useState("");
  const [confirmCancel, setConfirmCancel] = useState({ open: false, orderId: null });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const loadOrders = () => {
    setLoading(true);
    orderApi.getUserOrders()
      .then(setOrders)
      .catch(() => setError("Could not load orders. Is the order-service running on port 8085?"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const toggleExpand = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const handleCancelClick = (orderId) => {
    setConfirmCancel({ open: true, orderId });
  };

  const confirmCancelOrder = async () => {
    const orderId = confirmCancel.orderId;
    setCancelling(orderId);
    setConfirmCancel({ open: false, orderId: null });

    try {
      await orderApi.cancelOrder(orderId);
      showToast("Order cancelled. Stock has been restored.");
      loadOrders();
    } catch (e) {
      showToast(e?.response?.data?.message || "Could not cancel this order.");
    } finally {
      setCancelling(null);
    }
  };

  const allStatuses = ["ALL", ...Object.keys(STATUS_META)];
  const filtered    = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div style={s.container}>
      <div style={s.overlay} />

      <nav style={s.navbar}>
        <span style={s.brand} onClick={() => navigate("/")}>Urban Vogue</span>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={s.navBtn} onClick={() => navigate("/products")}>Shop</button>
          <button style={s.navBtn} onClick={() => navigate("/cart")}>Cart</button>
          <button style={s.navBtn} onClick={() => navigate("/address-book")}>Addresses</button>
        </div>
      </nav>

      <div style={s.content}>
        <h1 style={s.title}>My Orders</h1>
        <p style={s.subtitle}>Track and manage all your purchases</p>

        <div style={s.filterRow}>
          {allStatuses.map((st) => {
            const meta   = STATUS_META[st];
            const active = filter === st;
            return (
              <button key={st}
                style={{
                  ...s.filterBtn,
                  background:  active ? (meta ? meta.color : "#fff") : "rgba(255,255,255,0.06)",
                  color:       active ? "#000" : (meta ? meta.color : "#aaa"),
                  border:      `1px solid ${meta ? meta.color : "rgba(255,255,255,0.15)"}`,
                  fontWeight:  active ? "bold" : "normal",
                }}
                onClick={() => setFilter(st)}
              >
                {meta ? meta.label : "All"}
                {st !== "ALL" && (
                  <span style={s.filterCount}>{orders.filter((o) => o.status === st).length}</span>
                )}
              </button>
            );
          })}
        </div>

        {loading && <div style={s.emptyBox}><div style={s.spinner} /><p style={{ color: "#aaa", marginTop: 16 }}>Loading your orders…</p></div>}
        {!loading && error && <div style={s.emptyBox}><p style={{ fontSize: 36 }}>⚠️</p><p style={{ color: "#ff8080", marginTop: 8 }}>{error}</p></div>}
        {!loading && !error && filtered.length === 0 && (
          <div style={s.emptyBox}>
            <p style={{ fontSize: 48 }}>🛍️</p>
            <p style={{ color: "#aaa", marginTop: 8 }}>
              {filter === "ALL" ? "You haven't placed any orders yet." : `No ${filter.toLowerCase()} orders.`}
            </p>
            <button style={s.shopBtn} onClick={() => navigate("/products")}>Start Shopping</button>
          </div>
        )}

        {!loading && !error && filtered.map((order) => {
          const meta      = STATUS_META[order.status] || STATUS_META.PLACED;
          const open      = expanded[order.id];
          const itemCount = order.items?.length ?? 0;
          const canCancel = order.status === "PLACED" || order.status === "TRANSIT";

          return (
            <div key={order.id} style={{ ...s.card, borderColor: `${meta.color}44` }}>
              <div style={s.cardHeader}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={s.orderId}>Order #{order.id}</span>
                    <span style={{ ...s.badge, color: meta.color, borderColor: meta.color, background: meta.bg }}>
                      {meta.label}
                    </span>
                  </div>
                  <span style={s.orderMeta}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    &nbsp;·&nbsp;{itemCount} item{itemCount !== 1 ? "s" : ""}
                    &nbsp;·&nbsp;₹{fmt(order.totalAmount)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {canCancel && (
                    <button
                      style={s.cancelBtn}
                      onClick={() => handleCancelClick(order.id)}
                      disabled={cancelling === order.id}
                    >
                      {cancelling === order.id ? "…" : "Cancel"}
                    </button>
                  )}
                  <button style={s.expandBtn} onClick={() => toggleExpand(order.id)}>
                    {open ? "▲ Hide" : "▼ Details"}
                  </button>
                </div>
              </div>

              <StatusTracker status={order.status} />

              {open && (
                <div>
                  <hr style={s.divider} />
                  <p style={s.sectionLabel}>Items</p>
                  {order.items?.map((item, i) => (
                    <div key={i} style={s.itemRow}>
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.productName} style={s.img} />
                        : <div style={s.imgPlaceholder}>👗</div>
                      }
                      <div style={{ flex: 1 }}>
                        <p style={s.itemName}>{item.productName}</p>
                        <p style={s.itemMeta}>{item.brand} · Qty: {item.quantity}</p>
                      </div>
                      <p style={s.itemPrice}>₹{fmt(item.subtotal)}</p>
                    </div>
                  ))}
                  <hr style={s.divider} />
                  <div style={s.footerRow}>
                    <span style={s.addressText}>📍 {order.addressLine}, {order.city}, {order.state} — {order.pincode}</span>
                    <span style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>Total: ₹{fmt(order.totalAmount)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {toast && <div style={s.toast}>{toast}</div>}

      {/* Custom Cancel Modal */}
      {confirmCancel.open && (
        <div style={s.modalOverlay}>
          <div style={s.modalBox}>
            <p>Are you sure you want to cancel this order?</p>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: 16 }}>
              <button style={s.modalBtn} onClick={confirmCancelOrder}>Yes</button>
              <button style={s.modalBtn} onClick={() => setConfirmCancel({ open: false, orderId: null })}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles (added modal styles at the end)
const s = {
  container: { minHeight: "100vh", position: "relative", fontFamily: "Georgia" },
  overlay: { position: "fixed", inset: 0, backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 },
  navbar: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 36px", backdropFilter: "blur(10px)", background: "rgba(0,0,0,0.35)", borderBottom: "1px solid rgba(255,255,255,0.08)" },
  brand: { color: "#fff", fontSize: 20, fontWeight: "bold", cursor: "pointer", letterSpacing: 3 },
  navBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "7px 18px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia", borderRadius: 3 },
  content: { position: "relative", zIndex: 1, padding: "110px 32px 80px", maxWidth: 860, margin: "0 auto", color: "#fff" },
  title: {color: "white", fontSize: 38, fontWeight: "bold", letterSpacing: 3, margin: 0 },
  subtitle: { color: "#666", fontSize: 14, marginTop: 6, marginBottom: 24, letterSpacing: 1 },
  filterRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 },
  filterBtn: { padding: "6px 14px", borderRadius: 3, cursor: "pointer", fontSize: 12, fontFamily: "Georgia", letterSpacing: 1, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 },
  filterCount: { background: "rgba(0,0,0,0.25)", borderRadius: "50%", padding: "1px 6px", fontSize: 10 },
  emptyBox: { textAlign: "center", padding: "60px 20px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" },
  shopBtn: { marginTop: 20, padding: "10px 28px", background: "#fff", color: "#000", border: "none", cursor: "pointer", fontFamily: "Georgia", fontSize: 14, borderRadius: 4 },
  spinner: { width: 36, height: 36, borderRadius: "50%", margin: "0 auto", border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #fff", animation: "spin 0.9s linear infinite" },
  card: { background: "rgba(255,255,255,0.05)", border: "1px solid", backdropFilter: "blur(12px)", borderRadius: 10, padding: "20px 24px", marginBottom: 18 },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  orderId: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  orderMeta: { color: "#666", fontSize: 12, letterSpacing: 0.5 },
  badge: { fontSize: 10, fontWeight: "bold", letterSpacing: 2, border: "1px solid", padding: "2px 9px", borderRadius: 2, textTransform: "uppercase" },
  cancelBtn: { background: "transparent", border: "1px solid rgba(239,68,68,0.5)", color: "#ef4444", padding: "5px 12px", fontSize: 11, cursor: "pointer", fontFamily: "Georgia", borderRadius: 3 },
  expandBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#aaa", padding: "5px 12px", fontSize: 11, cursor: "pointer", fontFamily: "Georgia", borderRadius: 3, flexShrink: 0 },
  divider: { border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "14px 0" },
  sectionLabel: { color: "#666", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 10px" },
  itemRow: { display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  img: { width: 56, height: 56, objectFit: "cover", borderRadius: 6, background: "rgba(255,255,255,0.06)" },
  imgPlaceholder: { width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, background: "rgba(255,255,255,0.06)", borderRadius: 6, flexShrink: 0 },
  itemName: { color: "#fff", fontSize: 14, margin: "0 0 3px" },
  itemMeta: { color: "#666", fontSize: 12, margin: 0 },
  itemPrice: { color: "#ccc", fontSize: 14, fontWeight: "bold", margin: 0, flexShrink: 0 },
  footerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  addressText: { color: "#aaa", fontSize: 12 },
  toast: { position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#222", color: "#fff", padding: "10px 20px", borderRadius: 5, fontSize: 13, zIndex: 99 },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 30 },
  modalBox: { background: "#fff", padding: 24, borderRadius: 6, maxWidth: 320, width: "80%", textAlign: "center" },
  modalBtn: { padding: "8px 16px", cursor: "pointer", borderRadius: 4, border: "none", background: "#000", color: "#fff", fontWeight: "bold" },
};