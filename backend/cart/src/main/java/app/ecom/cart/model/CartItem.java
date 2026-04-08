package app.ecom.cart.model;

public class CartItem {

    private String productId;
    private String productName;
    private String brand;
    private String imageUrl;
    private double price;
    private int    quantity;
    private double subtotal;

    public CartItem() {}

    public CartItem(String productId, String productName,
                    String brand, String imageUrl,
                    double price, int quantity) {
        this.productId   = productId;
        this.productName = productName;
        this.brand       = brand;
        this.imageUrl    = imageUrl;
        this.price       = price;
        this.quantity    = quantity;
        this.subtotal    = price * quantity;
    }

    public String getProductId()         { return productId; }
    public void setProductId(String v)   { this.productId = v; }

    public String getProductName()          { return productName; }
    public void setProductName(String v)    { this.productName = v; }

    public String getBrand()             { return brand; }
    public void setBrand(String v)       { this.brand = v; }

    public String getImageUrl()          { return imageUrl; }
    public void setImageUrl(String v)    { this.imageUrl = v; }

    public double getPrice()             { return price; }
    public void setPrice(double v)       { this.price = v; }

    public int getQuantity()             { return quantity; }
    public void setQuantity(int v) {
        this.quantity = v;
        this.subtotal = this.price * v;
    }

    public double getSubtotal()          { return subtotal; }
    public void setSubtotal(double v)    { this.subtotal = v; }
}
