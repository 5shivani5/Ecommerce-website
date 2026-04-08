package app.ecom.cart.bean;

import app.ecom.cart.model.CartItem;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

import java.util.ArrayList;
import java.util.List;

@Component
@SessionScope
public class CartBean {

    private List<CartItem> items       = new ArrayList<>();
    private double         totalAmount = 0.0;
    private int            totalItems  = 0;

    public void calculateTotal() {
        this.totalAmount = items.stream()
            .mapToDouble(CartItem::getSubtotal)
            .sum();
        this.totalItems = items.stream()
            .mapToInt(CartItem::getQuantity)
            .sum();
    }

    public List<CartItem> getItems()         { return items; }
    public void setItems(List<CartItem> v)   { this.items = v; }

    public double getTotalAmount()           { return totalAmount; }
    public void setTotalAmount(double v)     { this.totalAmount = v; }

    public int getTotalItems()               { return totalItems; }
    public void setTotalItems(int v)         { this.totalItems = v; }
}
