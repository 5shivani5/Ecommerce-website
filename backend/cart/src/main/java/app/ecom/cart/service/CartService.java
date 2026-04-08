package app.ecom.cart.service;

import app.ecom.cart.bean.CartBean;
import app.ecom.cart.dto.CartRequestDTO;

public interface CartService {
    CartBean addItem(CartRequestDTO request);
    CartBean getCart();
    CartBean updateQuantity(String productId, int quantity);
    CartBean removeItem(String productId);
    void     clearCart();
    int      getItemCount();
}
