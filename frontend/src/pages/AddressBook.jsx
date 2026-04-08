import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import addressApi from "../api/addressApi";
import bgImage from "../assets/background.png";

const LABELS = ["Home", "Office", "Other"];

function AddressForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    addressLine: "", city: "", state: "", pincode: "", label: "Home", isDefault: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.addressLine.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(form);
    } catch {
      setError("Failed to save address. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div style={f.wrap}>
      <h3 style={f.title}>New Address</h3>

      {/* Label chips */}
      <div style={f.row}>
        {LABELS.map((l) => (
          <button
            key={l}
            style={{ ...f.chip, ...(form.label === l ? f.chipActive : {}) }}
            onClick={() => set("label", l)}
          >
            {l}
          </button>
        ))}
      </div>

      <input style={f.input} placeholder="Address Line *" value={form.addressLine}
        onChange={(e) => set("addressLine", e.target.value)} />
      <div style={f.twoCol}>
        <input style={f.input} placeholder="City *" value={form.city}
          onChange={(e) => set("city", e.target.value)} />
        <input style={f.input} placeholder="State *" value={form.state}
          onChange={(e) => set("state", e.target.value)} />
      </div>
      <input style={f.input} placeholder="Pincode *" value={form.pincode}
        onChange={(e) => set("pincode", e.target.value)} />

      <label style={f.checkRow}>
        <input type="checkbox" checked={form.isDefault}
          onChange={(e) => set("isDefault", e.target.checked)} />
        <span>Set as default address</span>
      </label>

      {error && <p style={f.error}>{error}</p>}

      <div style={f.btnRow}>
        <button style={f.saveBtn} onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving…" : "Save Address"}
        </button>
        <button style={f.cancelBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

const f = {
  wrap: {
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8, padding: "20px 24px", marginBottom: 20,
    display: "flex", flexDirection: "column", gap: 10,
  },
  title: { color: "#fff", margin: 0, fontSize: 16, letterSpacing: 1 },
  row: { display: "flex", gap: 8, flexWrap: "wrap" },
  chip: {
    padding: "5px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.25)",
    background: "transparent", color: "#aaa", cursor: "pointer", fontSize: 12,
    fontFamily: "Georgia",
  },
  chipActive: { background: "#fff", color: "#000", border: "1px solid #fff" },
  input: {
    padding: "10px 12px", borderRadius: 4,
    border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)",
    color: "#fff", fontSize: 14, fontFamily: "Georgia", flex: 1,
  },
  twoCol: { display: "flex", gap: 10 },
  checkRow: { display: "flex", alignItems: "center", gap: 8, color: "#bbb", fontSize: 13, cursor: "pointer" },
  error: { color: "#ff8080", fontSize: 13, margin: 0 },
  btnRow: { display: "flex", gap: 10, marginTop: 4 },
  saveBtn: {
    flex: 1, padding: "10px", background: "#fff", color: "#000",
    border: "none", cursor: "pointer", fontFamily: "Georgia", fontSize: 14, borderRadius: 4,
  },
  cancelBtn: {
    flex: 1, padding: "10px", background: "transparent", color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "Georgia", fontSize: 14, borderRadius: 4,
  },
};

export default function AddressBook() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [toast, setToast]         = useState("");
  const [deleting, setDeleting]   = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const load = async () => {
    try {
      const data = await addressApi.getAddresses();
      setAddresses(data);
    } catch {
      showToast("Could not load addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (form) => {
    await addressApi.addAddress(form);
    setShowForm(false);
    showToast("Address saved!");
    load();
  };

  const handleSetDefault = async (id) => {
    try {
      await addressApi.setDefault(id);
      showToast("Default address updated!");
      load();
    } catch {
      showToast("Failed to update default.");
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await addressApi.deleteAddress(id);
      showToast("Address deleted.");
      load();
    } catch {
      showToast("Failed to delete.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={s.container}>
      <div style={s.overlay} />

      <nav style={s.navbar}>
        <span style={s.brand} onClick={() => navigate("/")}>Urban Vogue</span>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={s.navBtn} onClick={() => navigate("/products")}>Shop</button>
          <button style={s.navBtn} onClick={() => navigate("/cart")}>Cart</button>
          <button style={s.navBtn} onClick={() => navigate("/order-history")}>My Orders</button>
        </div>
      </nav>

      <div style={s.content}>
        <div style={s.headerRow}>
          <div>
            <h1 style={s.title}>Address Book</h1>
            <p style={s.subtitle}>Manage your saved delivery addresses</p>
          </div>
          {!showForm && (
            <button style={s.addBtn} onClick={() => setShowForm(true)}>
              + Add New Address
            </button>
          )}
        </div>

        {/* Add form */}
        {showForm && (
          <AddressForm
            onSave={handleAdd}
            onCancel={() => setShowForm(false)}
          />
        )}

        {loading && <p style={s.info}>Loading…</p>}

        {!loading && addresses.length === 0 && !showForm && (
          <div style={s.emptyBox}>
            <p style={{ fontSize: 40 }}>📍</p>
            <p style={{ color: "#aaa", marginTop: 8 }}>No saved addresses yet.</p>
            <button style={s.addBtn} onClick={() => setShowForm(true)}>
              Add Your First Address
            </button>
          </div>
        )}

        {/* Address cards */}
        {addresses.map((addr) => (
          <div key={addr.id} style={{
            ...s.card,
            borderColor: addr.default ? "rgba(159,206,167,0.5)" : "rgba(255,255,255,0.12)",
            background: addr.default ? "rgba(159,206,167,0.06)" : "rgba(255,255,255,0.05)",
          }}>
            <div style={s.cardTop}>
              <div style={s.cardLeft}>
                {addr.label && (
                  <span style={s.labelBadge}>{addr.label}</span>
                )}
                {addr.default && (
                  <span style={s.defaultBadge}>✓ Default</span>
                )}
              </div>
              <div style={s.cardActions}>
                {!addr.default && (
                  <button style={s.actionBtn} onClick={() => handleSetDefault(addr.id)}>
                    Set Default
                  </button>
                )}
                <button
                  style={{ ...s.actionBtn, color: "#ff8080", borderColor: "rgba(255,128,128,0.3)" }}
                  onClick={() => handleDelete(addr.id)}
                  disabled={deleting === addr.id}
                >
                  {deleting === addr.id ? "…" : "Delete"}
                </button>
              </div>
            </div>

            <p style={s.addrLine}>{addr.addressLine}</p>
            <p style={s.addrMeta}>{addr.city}, {addr.state} — {addr.pincode}</p>
          </div>
        ))}
      </div>

      {toast && <div style={s.toast}>{toast}</div>}
    </div>
  );
}

const s = {
  container: {
    minHeight: "100vh",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed",
    position: "relative", fontFamily: "Georgia",
  },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", zIndex: 0 },
  navbar: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 2,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 36px", backdropFilter: "blur(10px)",
    background: "rgba(0,0,0,0.35)", borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  brand: { color: "#fff", fontSize: 20, fontWeight: "bold", cursor: "pointer", letterSpacing: 3 },
  navBtn: {
    background: "transparent", border: "1px solid rgba(255,255,255,0.3)",
    color: "#fff", padding: "7px 18px", fontSize: 13, cursor: "pointer",
    fontFamily: "Georgia", borderRadius: 3,
  },
  content: {
    position: "relative", zIndex: 1,
    padding: "110px 32px 80px", maxWidth: 760, margin: "0 auto", color: "#fff",
  },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  title:    { fontSize: 36, fontWeight: "bold", letterSpacing: 3, margin: 0 },
  subtitle: { color: "#666", fontSize: 13, marginTop: 6, letterSpacing: 1 },
  addBtn: {
    padding: "10px 20px", background: "#fff", color: "#000", border: "none",
    cursor: "pointer", fontFamily: "Georgia", fontSize: 13, borderRadius: 4, flexShrink: 0,
  },
  info:  { color: "#aaa", fontSize: 15 },
  emptyBox: {
    textAlign: "center", padding: "60px 20px",
    background: "rgba(255,255,255,0.04)", borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  card: {
    border: "1px solid", borderRadius: 8, padding: "16px 20px", marginBottom: 14,
    transition: "all 0.2s",
  },
  cardTop:     { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  cardLeft:    { display: "flex", gap: 8, alignItems: "center" },
  cardActions: { display: "flex", gap: 8 },
  labelBadge: {
    fontSize: 11, padding: "2px 10px", borderRadius: 20,
    background: "rgba(255,255,255,0.1)", color: "#ccc", letterSpacing: 1,
  },
  defaultBadge: {
    fontSize: 11, padding: "2px 10px", borderRadius: 20,
    background: "rgba(159,206,167,0.2)", color: "#9fcea7", letterSpacing: 1,
  },
  actionBtn: {
    background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
    color: "#bbb", padding: "4px 12px", fontSize: 12, cursor: "pointer",
    fontFamily: "Georgia", borderRadius: 3,
  },
  addrLine: { color: "#fff", fontSize: 15, margin: "0 0 4px" },
  addrMeta: { color: "#888", fontSize: 13, margin: 0 },
  toast: {
    position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
    background: "#111", color: "#fff", padding: "10px 24px", borderRadius: 6, zIndex: 10,
    border: "1px solid rgba(255,255,255,0.15)",
  },
};
