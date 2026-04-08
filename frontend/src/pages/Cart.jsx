import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; //  added
import cartApi from "../api/cartApi";
import bgImage from "../assets/background.png";

/* ─── Helpers ─── */
const fmt = (n) =>
  Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const GST_RATE = 0.18;
const FREE_SHIP_THRESHOLD = 999;
const SHIPPING_CHARGE = 99;

/* ─── Main Cart Component ─── */
export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const navigate = useNavigate(); //  added

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }, []);

  /* Load cart */
  const loadCart = useCallback(() => {
    setLoading(true);
    cartApi
      .getCart()
      .then(setCart)
      .catch(() => showToast("Could not load cart"))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const items = cart?.items ?? [];
  const subtotal = cart?.totalAmount ?? 0;
  const tax = subtotal * GST_RATE;
  const shipping =
    subtotal > 0 && subtotal < FREE_SHIP_THRESHOLD
      ? SHIPPING_CHARGE
      : 0;
  const grand = subtotal + tax + shipping;

  /* ── Handlers ── */
  const handleQtyChange = async (productId, qty) => {
    if (qty <= 0) return handleRemove(productId);
    try {
      const data = await cartApi.updateQuantity(productId, qty);
      setCart(data);
      showToast("Quantity updated");
    } catch (err) {
      console.error(err);
      showToast("Error updating quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      const data = await cartApi.removeFromCart(productId);
      setCart(data);
      showToast("Item removed");
    } catch (err) {
      console.error(err);
      showToast("Error removing item");
    }
  };

  const handleClear = async () => {
    try {
      const data = await cartApi.clearCart();
      setCart(data);
      showToast("Cart cleared");
    } catch (err) {
      console.error(err);
      showToast("Error clearing cart");
    }
  };

   const handleCheckout = () => {
      navigate("/payment", { state: { amount: grand, items: cart   } }); //  send total
    };


  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      {/* Header */}
      <nav style={styles.navbar}>
        <span style={styles.brand}>Urban Vogue</span>
      </nav>

      <div style={styles.content}>
        <h1 style={styles.title}>Your Cart</h1>

        {loading ? (
          <p style={styles.text}>Loading...</p>
        ) : items.length === 0 ? (
          <p style={styles.text}>Your cart is empty</p>
        ) : (
          <>
            <div style={styles.grid}>
              {items.map((item) => (
                <div key={item.productId} style={styles.card}>
                  <div style={styles.cardLeft}>
                    <img
                      src={item.imageUrl || ""}
                      alt={item.productName}
                      style={styles.image}
                    />
                    <div style={styles.cardInfo}>
                      <p style={styles.name}>{item.productName}</p>
                      <p style={styles.price}>₹{fmt(item.price)}</p>
                    </div>
                  </div>

                  <div style={styles.cardRight}>
                    <div style={styles.qty}>
                      <button
                        onClick={() =>
                          handleQtyChange(item.productId, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQtyChange(item.productId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      style={styles.remove}
                      onClick={() => handleRemove(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={styles.summary}>
              <p>Subtotal: ₹{fmt(subtotal)}</p>
              <p>GST: ₹{fmt(tax)}</p>
              <h3>Total: ₹{fmt(grand)}</h3>

              <div style={styles.summaryButtons}>
                {/*  Updated */}
                <button style={styles.checkout} onClick={handleCheckout}>
                  Checkout
                </button>

                <button style={styles.clear} onClick={handleClear}>
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}

/* ─── Styles ─── */
const styles = {
 container: {
   height: "100vh",          // fixed viewport
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
  navbar: {
    position: "fixed",
    top: 0,
    width: "100%",
    padding: "20px",
    zIndex: 2,
    color: "#fff",
  },
  brand: { fontSize: "20px", fontWeight: "bold", cursor: "pointer" },
  content: {
    position: "relative",
    zIndex: 1,
    height: "100vh",          // important
    overflowY: "auto",        // ONLY this scrolls
    padding: "120px 30px 80px",
    color: "#fff",
  },
  title: { color: "white", fontSize: "36px", marginBottom: "20px" },
  text: { color: "#ccc" },

  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    background: "rgba(255,255,255,0.1)",
    padding: "15px",
    borderRadius: "5px",
    alignItems: "center",
  },

  cardLeft: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },

  cardInfo: {
    display: "flex",
    flexDirection: "column",
  },

  cardRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "10px",
  },

  image: { width: "120px", height: "120px", objectFit: "cover" },
  name: { fontSize: "18px" },
  price: { color: "#ddd" },
  qty: { display: "flex", gap: "10px" },

  remove: {
    marginTop: "5px",
    color: "red",
    background: "none",
    border: "none",
    cursor: "pointer",
  },

  summary: {
    marginTop: "30px",
    background: "rgba(0,0,0,0.6)",
    padding: "20px",
    maxWidth: "400px",
    margin: "30px auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
  },

  summaryButtons: {
    display: "flex",
    gap: "4%",
    width: "100%",
    justifyContent: "center",
  },

  checkout: {
    marginTop: "10px",
    padding: "10px",
    width: "48%",
    background: "#fff",
    color: "#000",
    border: "none",
    cursor: "pointer",
  },

  clear: {
    marginTop: "10px",
    padding: "10px",
    width: "48%",
    background: "transparent",
    border: "1px solid #fff",
    color: "#fff",
    cursor: "pointer",
  },

  toast: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#000",
    color: "#fff",
    padding: "10px 20px",
  },
};
