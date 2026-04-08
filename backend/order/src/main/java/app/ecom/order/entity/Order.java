package app.ecom.order.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private double totalAmount;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private String addressLine;
    private String city;
    private String state;
    private String pincode;
    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public Order() {}

    public Order(Long userId, String username, double totalAmount,
                 String addressLine, String city, String state, String pincode) {
        this.userId      = userId;
        this.username    = username;
        this.totalAmount = totalAmount;
        this.status      = "PLACED";
        this.createdAt   = LocalDateTime.now();
        this.addressLine = addressLine;
        this.city        = city;
        this.state       = state;
        this.pincode     = pincode;
    }

    // ✅ IMPORTANT: helper method to maintain relationship
    public void addItem(OrderItem item) {
        item.setOrder(this);   // 🔥 sets foreign key
        this.items.add(item);
    }

    public void removeItem(OrderItem item) {
        item.setOrder(null);
        this.items.remove(item);
    }

    // Getters & Setters

    public Long getId()                       { return id; }
    public void setId(Long v)                 { this.id = v; }

    public Long getUserId()                   { return userId; }
    public void setUserId(Long v)             { this.userId = v; }

    public String getUsername()               { return username; }
    public void setUsername(String v)         { this.username = v; }

    public String getStatus()                 { return status; }
    public void setStatus(String v)           { this.status = v; }

    public double getTotalAmount()            { return totalAmount; }
    public void setTotalAmount(double v)      { this.totalAmount = v; }

    public LocalDateTime getCreatedAt()       { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }

    public String getAddressLine()            { return addressLine; }
    public void setAddressLine(String v)      { this.addressLine = v; }

    public String getCity()                   { return city; }
    public void setCity(String v)             { this.city = v; }

    public String getState()                  { return state; }
    public void setState(String v)            { this.state = v; }

    public String getPincode()                { return pincode; }
    public void setPincode(String v)          { this.pincode = v; }

    public List<OrderItem> getItems()         { return items; }
    public void setItems(List<OrderItem> v)   { this.items = v; }
}