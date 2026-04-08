package app.ecom.cart.dto;

import app.ecom.cart.bean.CartBean;
import app.ecom.cart.model.CartItem;
import java.util.List;

public class CartResponseDTO {

    private List<CartItem> items;
    private double         totalAmount;
    private int            totalItems;
    private String         message;

    public static CartResponseDTO from(CartBean bean) {
        CartResponseDTO dto = new CartResponseDTO();
        dto.setItems(bean.getItems());
        dto.setTotalAmount(bean.getTotalAmount());
        dto.setTotalItems(bean.getTotalItems());
        return dto;
    }

    public static CartResponseDTO from(CartBean bean, String msg) {
        CartResponseDTO dto = from(bean);
        dto.setMessage(msg);
        return dto;
    }

    public List<CartItem> getItems()         { return items; }
    public void setItems(List<CartItem> v)   { this.items = v; }

    public double getTotalAmount()           { return totalAmount; }
    public void setTotalAmount(double v)     { this.totalAmount = v; }

    public int getTotalItems()               { return totalItems; }
    public void setTotalItems(int v)         { this.totalItems = v; }

    public String getMessage()               { return message; }
    public void setMessage(String v)         { this.message = v; }
}
