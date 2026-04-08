import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import orderApi from "../api/orderApi";
import cartApi from "../api/cartApi";
import addressApi from "../api/addressApi";
import bgImage from "../assets/background.png";

const PAYMENT_BASE_URL = "http://localhost:8083/payment";

export default function Payment() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [wallet, setWallet]           = useState(0);
  const [walletLoading, setWalletLoading] = useState(true);
  const [addresses, setAddresses]     = useState([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [selectedId, setSelectedId]   = useState(null);   // id of chosen saved address
  const [showNewForm, setShowNewForm] = useState(false);   // show inline add-form
  const [processing, setProcessing]   = useState(false);
  const [toast, setToast]             = useState("");

  // Inline new-address form fields
  const [newAddr, setNewAddr] = useState({ addressLine: "", city: "", state: "", pincode: "", label: "Home" });

  const totalAmount = location.state?.amount || 0;
// 🔥 BULLETPROOF FIX
const rawCart = location.state?.items;

const items = Array.isArray(rawCart)
  ? rawCart
  : Array.isArray(rawCart?.items)
    ? rawCart.items
    : [];
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const getUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("no token");

      return jwtDecode(token).userId;
    } catch {
      showToast("Session expired. Please login again.");
      navigate("/login");
      return null;
    }
  };

  // Load wallet balance
  useEffect(() => {
    (async () => {
      try {
        const uid = getUserId();
        if (!uid) return;
const token = localStorage.getItem("token");

const res = await axios.get(
  `${PAYMENT_BASE_URL}/balance/${uid}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);        setWallet(res.data);
      } catch { showToast("Error loading wallet balance."); }
      finally  { setWalletLoading(false); }
    })();
  }, []);

  // Load saved addresses
  useEffect(() => {
    (async () => {
      try {
        const data = await addressApi.getAddresses();
        setAddresses(data);
        // Pre-select default address if present
        const def = data.find((a) => a.default);
        if (def) setSelectedId(def.id);
        // If no addresses exist at all, open the add form automatically
        if (data.length === 0) setShowNewForm(true);
      } catch { showToast("Could not load saved addresses."); }
      finally  { setAddrLoading(false); }
    })();
  }, []);

  const setNA = (k, v) => setNewAddr((p) => ({ ...p, [k]: v }));

  const handleSaveNewAddress = async () => {
    const { addressLine, city, state, pincode } = newAddr;
    if (!addressLine.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      showToast("Please fill in all address fields.");
      return;
    }
    try {
      const saved = await addressApi.addAddress({ ...newAddr, isDefault: addresses.length === 0 });
      const updated = await addressApi.getAddresses();
      setAddresses(updated);
      setSelectedId(saved.id);
      setShowNewForm(false);
      setNewAddr({ addressLine: "", city: "", state: "", pincode: "", label: "Home" });
      showToast("Address saved!");
    } catch { showToast("Failed to save address."); }
  };
const getDecodedUser = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token");

    const decoded = jwtDecode(token);

    return {
      userId: decoded.userId,
      username: decoded.sub,
    };
  } catch {
    showToast("Session expired. Please login again.");
    navigate("/login");
    return null;
  }
};
  const handlePay = async () => {
    if (!selectedId) {
      showToast("Please select or add a delivery address.");
      return;
    }

    const addr = addresses.find((a) => a.id === selectedId);
    if (!addr) {
      showToast("Selected address not found.");
      return;
    }

    try {
      setProcessing(true);

      const user = getDecodedUser();
      if (!user) return;

      const { userId, username } = user;
console.log("RAW CART:", rawCart);
console.log("FINAL ITEMS:", items);
      // 🔥 CRITICAL FIX: FORMAT ITEMS FOR BACKEND
      const formattedItems = items.map((item) => ({
        productId: Number(item.productId || item.id),   // ✅ FIXES Long error
        productName: item.productName || item.name,
        brand: item.brand,
        imageUrl: item.imageUrl || null,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      console.log("FINAL ITEMS SENT:", formattedItems);

      // ✅ PLACE ORDER
      const order = await orderApi.placeOrder({
        userId,
        username,
        totalAmount,
        addressLine: addr.addressLine,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        items: formattedItems,
      });

      // ✅ PAYMENT
      const token = localStorage.getItem("token");

      await axios.post(
        `${PAYMENT_BASE_URL}/pay`,
        null,
        {
          params: {
            userId,
            amount: totalAmount,
            orderId: order.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ CLEAR CART
      try {
        await cartApi.clearCart();
      } catch {}

      showToast("Payment Successful!");

        navigate("/orders");


    } catch (err) {
      console.error("Payment error:", err);
      showToast("Payment Failed. Please try again.");
      setProcessing(false);
    }
  };

  const loading = walletLoading || addrLoading;

  return (
    <div style={s.container}>
      <div style={s.overlay} />

      <div style={s.content}>
        <h1 style={s.pageTitle}>Checkout</h1>

        {loading ? (
          <p style={s.info}>Loading…</p>
        ) : (
          <div style={s.card}>

            {/* ── Wallet summary ── */}
            <div style={s.summaryRow}>
              <span style={s.label}>Wallet Balance</span>
              <span style={s.value}>₹{fmt(wallet)}</span>
            </div>
            <div style={s.summaryRow}>
              <span style={s.label}>Order Total</span>
              <span style={{ ...s.value, fontWeight: "bold" }}>₹{fmt(totalAmount)}</span>
            </div>
            {wallet < totalAmount && (
              <p style={s.insufficientMsg}>⚠ Insufficient wallet balance</p>
            )}

            <div style={s.divider} />

            {/* ── Address section ── */}
            <p style={s.sectionTitle}>📍 Delivery Address</p>

            {/* Saved address list */}
            {addresses.map((addr) => (
              <div
                key={addr.id}
                style={{
                  ...s.addrCard,
                  borderColor: selectedId === addr.id ? "#9fcea7" : "rgba(255,255,255,0.12)",
                  background:  selectedId === addr.id ? "rgba(159,206,167,0.08)" : "rgba(255,255,255,0.04)",
                  cursor: "pointer",
                }}
                onClick={() => { setSelectedId(addr.id); setShowNewForm(false); }}
              >
                <div style={s.addrRadioRow}>
                  <div style={{
                    ...s.radio,
                    borderColor: selectedId === addr.id ? "#9fcea7" : "rgba(255,255,255,0.3)",
                    background:  selectedId === addr.id ? "#9fcea7" : "transparent",
                  }} />
                  <div>
                    <div style={s.addrTags}>
                      {addr.label && <span style={s.tag}>{addr.label}</span>}
                      {addr.default && <span style={s.defaultTag}>Default</span>}
                    </div>
                    <p style={s.addrText}>{addr.addressLine}</p>
                    <p style={s.addrMeta}>{addr.city}, {addr.state} — {addr.pincode}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Add new address toggle */}
            {!showNewForm ? (
              <button style={s.addNewBtn} onClick={() => { setShowNewForm(true); setSelectedId(null); }}>
                + Add New Address
              </button>
            ) : (
              <div style={s.inlineForm}>
                <p style={s.sectionTitle}>New Address</p>

                {/* Label chips */}
                <div style={s.chipRow}>
                  {["Home", "Office", "Other"].map((l) => (
                    <button key={l}
                      style={{ ...s.chip, ...(newAddr.label === l ? s.chipActive : {}) }}
                      onClick={() => setNA("label", l)}
                    >{l}</button>
                  ))}
                </div>

                <input style={s.input} placeholder="Address Line *"
                  value={newAddr.addressLine} onChange={(e) => setNA("addressLine", e.target.value)} />
                <div style={s.twoCol}>
                  <input style={s.input} placeholder="City *"
                    value={newAddr.city} onChange={(e) => setNA("city", e.target.value)} />
                  <input style={s.input} placeholder="State *"
                    value={newAddr.state} onChange={(e) => setNA("state", e.target.value)} />
                </div>
                <input style={s.input} placeholder="Pincode *"
                  value={newAddr.pincode} onChange={(e) => setNA("pincode", e.target.value)} />

                <div style={s.formBtns}>
                  <button style={s.saveAddrBtn} onClick={handleSaveNewAddress}>Save Address</button>
                  {addresses.length > 0 && (
                    <button style={s.cancelFormBtn} onClick={() => setShowNewForm(false)}>Cancel</button>
                  )}
                </div>
              </div>
            )}

            <div style={s.divider} />

            {/* ── Pay button ── */}
            {wallet >= totalAmount ? (
              <button
                style={{ ...s.payBtn, opacity: (processing || !selectedId) ? 0.6 : 1 }}
                onClick={handlePay}
                disabled={processing || !selectedId}
              >
                {processing ? "Processing…" : `Pay ₹${fmt(totalAmount)}`}
              </button>
            ) : (
              <button style={{ ...s.payBtn, background: "#555", cursor: "not-allowed" }} disabled>
                Insufficient Balance
              </button>
            )}

            <button style={s.manageBtn} onClick={() => navigate("/address-book")}>
              Manage All Addresses →
            </button>
          </div>
        )}
      </div>

      {toast && <div style={s.toast}>{toast}</div>}
    </div>
  );
}

const fmt = (n) =>
  Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const s = {
    container: {
       height: "100vh",
       width: "100%",
       backgroundImage: `url(${bgImage})`,
       backgroundSize: "cover",
       backgroundPosition: "center",
       backgroundAttachment: "fixed",
       position: "relative",
       fontFamily: "Georgia",
       overflow: "hidden", // prevent body scrollbar
     },
     overlay: {
       position: "fixed",
       inset: 0,
       background: "rgba(0,0,0,0.78)",
       pointerEvents: "none",
     },
     content: {
       position: "relative",
       zIndex: 1,
       color: "#fff",
       padding: "80px 20px 60px",
       maxHeight: "100vh",      // fits inside container
       width: "100%",
       overflowY: "auto",       // scrollable content
       display: "flex",
       flexDirection: "column",
       alignItems: "center",
     },
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.78)",
      pointerEvents: "none", // allow clicks on content
    },

  pageTitle: {color: "white",  fontSize: 32, fontWeight: "bold", letterSpacing: 3, marginBottom: 24 },
  info:      { color: "#aaa" },
  card: {
    width: "100%", maxWidth: 480, background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
    padding: "24px 28px", display: "flex", flexDirection: "column", gap: 12,
  },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  label:    { color: "#888", fontSize: 14 },
  value:    { color: "#fff", fontSize: 15 },
  insufficientMsg: { color: "#ff8080", fontSize: 13, margin: 0 },
  divider:  { height: 1, background: "rgba(255,255,255,0.08)", margin: "4px 0" },
  sectionTitle: { color: "#aaa", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", margin: 0 },

  addrCard: {
    border: "1px solid", borderRadius: 6, padding: "12px 14px",
    transition: "all 0.2s",
  },
  addrRadioRow: { display: "flex", gap: 12, alignItems: "flex-start" },
  radio: { width: 14, height: 14, borderRadius: "50%", border: "2px solid", marginTop: 4, flexShrink: 0, transition: "all 0.2s" },
  addrTags:   { display: "flex", gap: 6, marginBottom: 4 },
  tag:        { fontSize: 10, padding: "1px 8px", borderRadius: 20, background: "rgba(255,255,255,0.1)", color: "#bbb", letterSpacing: 1 },
  defaultTag: { fontSize: 10, padding: "1px 8px", borderRadius: 20, background: "rgba(159,206,167,0.15)", color: "#9fcea7", letterSpacing: 1 },
  addrText: { color: "#fff", fontSize: 14, margin: "0 0 2px" },
  addrMeta: { color: "#777", fontSize: 12, margin: 0 },

  addNewBtn: {
    background: "transparent", border: "1px dashed rgba(255,255,255,0.25)",
    color: "#aaa", padding: "10px", cursor: "pointer",
    fontFamily: "Georgia", fontSize: 13, borderRadius: 6, textAlign: "center",
  },

  inlineForm: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8, padding: "16px", display: "flex", flexDirection: "column", gap: 10,
  },
  chipRow:  { display: "flex", gap: 8 },
  chip:     { padding: "4px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#aaa", cursor: "pointer", fontSize: 12, fontFamily: "Georgia" },
  chipActive: { background: "#fff", color: "#000", border: "1px solid #fff" },
  input: {
    padding: "10px 12px", borderRadius: 4,
    border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.07)",
    color: "#fff", fontSize: 14, fontFamily: "Georgia", flex: 1,
  },
  twoCol:  { display: "flex", gap: 10 },
  formBtns: { display: "flex", gap: 8 },
  saveAddrBtn: {
    flex: 1, padding: "9px", background: "#fff", color: "#000",
    border: "none", cursor: "pointer", fontFamily: "Georgia", fontSize: 13, borderRadius: 4,
  },
  cancelFormBtn: {
    flex: 1, padding: "9px", background: "transparent", color: "#aaa",
    border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", fontFamily: "Georgia", fontSize: 13, borderRadius: 4,
  },

  payBtn: {
    padding: "14px", background: "#fff", color: "#000",
    border: "none", cursor: "pointer", fontFamily: "Georgia", fontSize: 15,
    borderRadius: 6, fontWeight: "bold", letterSpacing: 1,
    transition: "opacity 0.2s",
  },
  manageBtn: {
    background: "transparent", border: "none", color: "#666",
    fontSize: 12, cursor: "pointer", fontFamily: "Georgia", textAlign: "center", letterSpacing: 1,
  },
  toast: {
    position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
    background: "#111", color: "#fff", padding: "10px 24px", borderRadius: 6, zIndex: 10,
    border: "1px solid rgba(255,255,255,0.15)", fontSize: 14,
  },
};
