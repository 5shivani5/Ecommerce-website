package app.ecom.order.dto;

import java.util.List;

public class OrderRequestDTO {

    private Long userId;
    private String username;
    private double totalAmount;
    private String addressLine;
    private String city;
    private String state;
    private String pincode;
    private List<ItemDTO> items;

    public Long getUserId() { return userId; }
    public void setUserId(Long v) { this.userId = v; }

    public String getUsername() { return username; }
    public void setUsername(String v) { this.username = v; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double v) { this.totalAmount = v; }

    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String v) { this.addressLine = v; }

    public String getCity() { return city; }
    public void setCity(String v) { this.city = v; }

    public String getState() { return state; }
    public void setState(String v) { this.state = v; }

    public String getPincode() { return pincode; }
    public void setPincode(String v) { this.pincode = v; }

    public List<ItemDTO> getItems() { return items; }
    public void setItems(List<ItemDTO> v) { this.items = v; }

    public static class ItemDTO {
        private Long productId;   // ✅ FIXED
        private String productName;
        private String brand;
        private String imageUrl;
        private double price;
        private int quantity;
        private double subtotal;

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
        public void setQuantity(int v) { this.quantity = v; }

        public double getSubtotal() { return subtotal; }
        public void setSubtotal(double v) { this.subtotal = v; }
    }
}