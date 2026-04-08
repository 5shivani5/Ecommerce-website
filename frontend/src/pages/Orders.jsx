import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/background.png";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div style={s.container}>
      <div style={s.overlay} />

      {/* ── NAVBAR ── */}
      <nav style={s.navbar}>
        <span style={s.navBrand} onClick={() => navigate("/")}>
          Urban Vogue
        </span>
        <div style={s.navLinks}>
          <button style={s.navBtn} onClick={() => navigate("/products")}>
            Shop
          </button>
          <button style={s.navBtn} onClick={() => navigate("/cart")}>
            Cart
          </button>
          <button style={s.navBtn} onClick={() => navigate("/order-history")}>
            Order History
          </button>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <div style={s.content}>
        <div style={s.successCard}>
          <div style={s.checkCircle}>✓</div>

          <h2 style={s.successTitle}>
            Payment Successful — Order Placed!
          </h2>

          <p style={s.successSub}>
            Thank you for shopping with Urban Vogue. Your order has been confirmed.
          </p>

          <div style={s.bannerBtns}>
            <button
              style={s.primaryBtn}
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>

            <button
              style={s.secondaryBtn}
              onClick={() => navigate("/order-history")}
            >
              View Order History
            </button>
          </div>
        </div>
      </div>

      {toast && <div style={s.toast}>{toast}</div>}
    </div>
  );
}

const s = {
  container: {
    height: "100vh",
    overflow: "hidden",
    position: "relative",
    fontFamily: "Georgia",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 0,
  },

  content: {
    position: "relative",
    zIndex: 1,
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "60px", //  adjust for navbar height
    color: "#fff",
  },

  successCard: {
    width: "100%",
    maxWidth: 520,
    background:
      "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(56,189,248,0.10))",
    border: "1px solid rgba(34,197,94,0.35)",
    borderRadius: 12,
    padding: "40px 32px",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    //  REMOVED transform: translateY(-20px)
  },

  checkCircle: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "rgba(34,197,94,0.2)",
    border: "2px solid #22c55e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    color: "#22c55e",
    margin: "0 auto 18px",
  },

  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#22c55e",
    margin: "0 0 10px",
    letterSpacing: 1,
  },

  successSub: {
    color: "#aaa",
    fontSize: 14,
    margin: "0 0 26px",
    lineHeight: 1.6,
  },

  bannerBtns: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
  },

  primaryBtn: {
    padding: "10px 28px",
    background: "#fff",
    color: "#000",
    border: "none",
    cursor: "pointer",
    fontFamily: "Georgia",
    fontSize: 14,
    borderRadius: 4,
  },

  secondaryBtn: {
    padding: "10px 28px",
    background: "transparent",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
    cursor: "pointer",
    fontFamily: "Georgia",
    fontSize: 14,
    borderRadius: 4,
  },

  toast: {
    position: "fixed",
    bottom: 24,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#111",
    color: "#fff",
    padding: "10px 24px",
    borderRadius: 6,
    zIndex: 10,
    border: "1px solid rgba(255,255,255,0.15)",
    fontSize: 14,
  },

  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 36px",
    backdropFilter: "blur(10px)",
    background: "rgba(0,0,0,0.35)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  navBrand: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
    textTransform: "uppercase",
    cursor: "pointer",
  },

  navLinks: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },

  navBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#fff",
    padding: "7px 18px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "Georgia",
    borderRadius: 3,
  },
};
