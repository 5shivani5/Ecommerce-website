package app.ecom.order.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;   // ✅ FIXED

    private String productName;
    private String brand;
    private String imageUrl;
    private double price;
    private int quantity;
    private double subtotal;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;

    public OrderItem() {}

    public OrderItem(Long productId, String productName, String brand,
                     String imageUrl, double price, int quantity, Order order) {
        this.productId   = productId;
        this.productName = productName;
        this.brand       = brand;
        this.imageUrl    = imageUrl;
        this.price       = price;
        this.quantity    = quantity;
        this.subtotal    = price * quantity;
        this.order       = order;
    }

    public Long getId() { return id; }
    public void setId(Long v) { this.id = v; }

    public Long getProductId() { return productId; }
    public void setProductId(Long v) { this.productId = v; }

    public String getProductName() { return productName; }
    public void setProductName(String v) { this.productName = v; }

    public String getBrand() { return brand; }
    public void setBrand(String v) { this.brand = v; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String v) { this.imageUrl = v; }

    public double getPrice() { return price; }
    public void setPrice(double v) { this.price = v; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int v) {
        this.quantity = v;
        this.subtotal = this.price * v;
    }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double v) { this.subtotal = v; }

    public Order getOrder() { return order; }
    public void setOrder(Order v) { this.order = v; }
}