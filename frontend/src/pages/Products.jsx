import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductsByCategory } from "../api/productApi";
import bgImage from "../assets/background.png";
import menImg from "../assets/men.jpg";
import womenImg from "../assets/women.jpg";
import kidsImg from "../assets/kids.jpg";
import cartApi from "../api/cartApi";

function Products() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
const [cartCount, setCartCount] = useState(0);

const loadCartCount = async () => {
  try {
    const cart = await cartApi.getCart();
    const count = cart.items?.length || 0;
    setCartCount(count);
  } catch (err) {
    console.error("Cart load error:", err);
  }
};
useEffect(() => {
  loadCartCount();
}, []);
  useEffect(() => {
    if (category) {
      setLoading(true);
     getProductsByCategory(category)
       .then((data) => {
         console.log("API RESPONSE:", data); // 👈 ADD THIS
         setProducts(data);
         setLoading(false);
       })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [category]);

  const handleAddToCart = async (product) => {
    try {
      const response = await cartApi.addToCart(product);
      console.log("Cart response:", response);

      // ✅ update count
      setCartCount((prev) => prev + 1);

    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };


  if (!category) {
    const categories = [
      { key: "men", label: "MEN", img: menImg },
      { key: "women", label: "WOMEN", img: womenImg },
      { key: "kids", label: "KIDS", img: kidsImg },
    ];

    return (
      <div style={styles.container}>
          <div style={styles.backgroundFixed} />
        <div style={styles.overlay} />
        <nav style={styles.navbar}>
          <span style={styles.navBrand} onClick={() => navigate("/")}>
            Urban Vogue
          </span>
        </nav>

        <div style={styles.content}>
          <h1 style={styles.title}>Shop by Category</h1>
          <p style={styles.tagline}>What are you shopping for today?</p>

          <div style={styles.grid}>
            {categories.map((cat) => (
              <div
                key={cat.key}
                style={styles.categoryCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.border =
                    "1px solid rgba(255,255,255,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.border =
                    "1px solid rgba(255,255,255,0.2)";
                }}
                onClick={() => navigate(`/products/${cat.key}`)}
              >
                <img src={cat.img} alt={cat.label} style={styles.categoryImage} />
                <div style={styles.categoryOverlay}>
                  <p style={styles.categoryLabel}>{cat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Products listing screen
  return (
    <div style={styles.container}>
        <div style={styles.backgroundFixed} />
      <div style={styles.overlay} />

      <nav style={styles.navbar}>
        <span style={styles.navBrand} onClick={() => navigate("/")}>
          Urban Vogue
        </span>

        <div style={styles.navActions}>
            <button
              style={styles.backBtn}
              onClick={() => navigate("/")}
            >
              Home
            </button>
          <button
            style={styles.backBtn}
            onClick={() => navigate("/products")}
          >
            ← All Categories
          </button>

          <button
            style={styles.checkoutBtn}
            onClick={() => navigate("/cart")}
          >
            🛒 Cart ({cartCount})
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <h1 style={styles.title}>{category.toUpperCase()}</h1>
        <p style={styles.tagline}>
          {products.length} item{products.length !== 1 ? "s" : ""} found
        </p>

        {loading ? (
          <p style={styles.loadingText}>Loading...</p>
        ) : products.length === 0 ? (
          <p style={styles.loadingText}>No products found.</p>
        ) : (
          <div style={styles.grid}>
            {products.map((product) => {
              console.log(product.imageUrl); // 👈 ADD HERE

              return (
                <div key={product.productId} style={styles.productCard}>
                  <div style={styles.imageWrapper}>
                   <img
                     src={`http://localhost:8082${product.imagePath}`}
                     alt={product.name}
                     style={styles.image}
                   />
                  </div>
                  <div style={styles.cardBody}>
                    <p style={styles.productName}>{product.name}</p>
                    <p style={styles.productPrice}>₹{product.price}</p>

                    <button
                      style={styles.addBtn}
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Georgia', serif",
      position: "relative",
      // ← removed all background properties from here
  },
  backgroundFixed: {
      position: "fixed",
      inset: 0,
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      zIndex: -1,
  },
  navActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  checkoutBtn: {
    background: "#fff",
    color: "#000",
    border: "1px solid #fff",
    padding: "7px 16px",
    fontSize: "13px",
    letterSpacing: "1px",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
    borderRadius: "2px",
    transition: "all 0.3s ease",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    zIndex: 0,
  },
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 32px",
    zIndex: 2,
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(8px)",
    background: "rgba(0,0,0,0.3)",
  },
  navBrand: {
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
    letterSpacing: "2px",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  backBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.4)",
    color: "#fff",
    padding: "7px 16px",
    fontSize: "13px",
    letterSpacing: "1px",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
    borderRadius: "2px",
    transition: "all 0.3s ease",
  },
  content: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "120px 30px 60px",
    width: "100%",
    maxWidth: "1200px",
  },
  title: {
    fontSize: "42px",
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: "4px",
    marginBottom: "10px",
    textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
  },
  tagline: {
    fontSize: "14px",
    color: "#aaa",
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "50px",
  },
  loadingText: {
    color: "#aaa",
    fontSize: "16px",
    letterSpacing: "1px",
  },
  categoryCard: {
    position: "relative",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "4px",
    width: "220px",
    height: "280px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.4s ease",
  },
  categoryOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
    padding: "30px 16px 20px",
    textAlign: "center",
  },
  categoryLabel: {
    color: "#fff",
    fontSize: "16px",
    letterSpacing: "4px",
    margin: 0,
    fontWeight: "bold",
  },
  productCard: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "4px",
    width: "220px",
    overflow: "hidden",
    transition: "all 0.3s ease",
  },
  imageWrapper: {
    width: "100%",
    height: "200px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  cardBody: {
    padding: "16px",
    textAlign: "left",
  },
  productName: {
    color: "#fff",
    fontSize: "14px",
    letterSpacing: "0.5px",
    marginBottom: "6px",
    margin: "0 0 6px 0",
  },
  productPrice: {
    color: "#ccc",
    fontSize: "15px",
    fontWeight: "bold",
    margin: "0 0 14px 0",
  },
  addBtn: {
    width: "100%",
    padding: "9px 0",
    background: "#fff",
    color: "#000",
    border: "1px solid #fff",
    fontSize: "12px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
    transition: "all 0.3s ease",
    borderRadius: "2px",
  },
  grid: {
    display: "flex",
    gap: "24px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
};

export default Products;