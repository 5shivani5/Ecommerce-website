package app.ecom.cart.dto;

public class CartRequestDTO {

    private String productId;
    private String productName;
    private String brand;
    private String imageUrl;
    private double price;
    private int    quantity;

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
    public void setQuantity(int v)       { this.quantity = v; }
}
