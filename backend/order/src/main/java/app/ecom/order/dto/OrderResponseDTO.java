package app.ecom.order.dto;

import app.ecom.order.entity.Order;
import app.ecom.order.entity.OrderItem;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderResponseDTO {

    private Long id;
    private Long userId;
    private String username;
    private String status;
    private double totalAmount;
    private LocalDateTime createdAt;
    private String addressLine;
    private String city;
    private String state;
    private String pincode;
    private String message;
    private List<ItemDTO> items;

    public static OrderResponseDTO from(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.id = order.getId();
        dto.userId = order.getUserId();
        dto.username = order.getUsername();
        dto.status = order.getStatus();
        dto.totalAmount = order.getTotalAmount();
        dto.createdAt = order.getCreatedAt();
        dto.addressLine = order.getAddressLine();
        dto.city = order.getCity();
        dto.state = order.getState();
        dto.pincode = order.getPincode();
        dto.items = order.getItems().stream()
                .map(ItemDTO::from)
                .collect(Collectors.toList());
        return dto;
    }

    public static OrderResponseDTO from(Order order, String message) {
        OrderResponseDTO dto = from(order);
        dto.message = message;
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long v) { this.id = v; }

    public Long getUserId() { return userId; }
    public void setUserId(Long v) { this.userId = v; }

    public String getUsername() { return username; }
    public void setUsername(String v) { this.username = v; }

    public String getStatus() { return status; }
    public void setStatus(String v) { this.status = v; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double v) { this.totalAmount = v; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }

    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String v) { this.addressLine = v; }

    public String getCity() { return city; }
    public void setCity(String v) { this.city = v; }

    public String getState() { return state; }
    public void setState(String v) { this.state = v; }

    public String getPincode() { return pincode; }
    public void setPincode(String v) { this.pincode = v; }

    public String getMessage() { return message; }
    public void setMessage(String v) { this.message = v; }

    public List<ItemDTO> getItems() { return items; }
    public void setItems(List<ItemDTO> v) { this.items = v; }

    // 🔥 FIXED INNER CLASS
    public static class ItemDTO {

        private Long productId;   // ✅ FIXED
        private String productName;
        private String brand;
        private String imageUrl;
        private double price;
        private int quantity;
        private double subtotal;

        public static ItemDTO from(OrderItem i) {
            ItemDTO dto = new ItemDTO();
            dto.productId = i.getProductId();   // ✅ now matches
            dto.productName = i.getProductName();
            dto.brand = i.getBrand();
            dto.imageUrl = i.getImageUrl();
            dto.price = i.getPrice();
            dto.quantity = i.getQuantity();
            dto.subtotal = i.getSubtotal();
            return dto;
        }

        public Long getProductId() { return productId; }
        public String getProductName() { return productName; }
        public String getBrand() { return brand; }
        public String getImageUrl() { return imageUrl; }
        public double getPrice() { return price; }
        public int getQuantity() { return quantity; }
        public double getSubtotal() { return subtotal; }
    }
}