package app.ecom.cart.service.impl;

import app.ecom.cart.bean.CartBean;
import app.ecom.cart.dto.CartRequestDTO;
import app.ecom.cart.model.CartItem;
import app.ecom.cart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartBean cartBean;

    @Override
    public CartBean addItem(CartRequestDTO request) {
        Optional<CartItem> existing = cartBean.getItems().stream()
            .filter(i -> i.getProductId().equals(request.getProductId()))
            .findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(
                existing.get().getQuantity() + request.getQuantity());
        } else {
            cartBean.getItems().add(new CartItem(
                request.getProductId(),
                request.getProductName(),
                request.getBrand(),
                request.getImageUrl(),
                request.getPrice(),
                request.getQuantity()
            ));
        }
        cartBean.calculateTotal();
        return cartBean;
    }

    @Override
    public CartBean getCart() {
        cartBean.calculateTotal();
        return cartBean;
    }

    @Override
    public CartBean updateQuantity(String productId, int quantity) {
        cartBean.getItems().stream()
            .filter(i -> i.getProductId().equals(productId))
            .findFirst()
            .ifPresent(item -> {
                if (quantity <= 0) {
                    cartBean.getItems().remove(item);
                } else {
                    item.setQuantity(quantity);
                }
            });
        cartBean.calculateTotal();
        return cartBean;
    }

    @Override
    public CartBean removeItem(String productId) {
        cartBean.getItems()
            .removeIf(i -> i.getProductId().equals(productId));
        cartBean.calculateTotal();
        return cartBean;
    }

    @Override
    public void clearCart() {
        cartBean.getItems().clear();
        cartBean.calculateTotal();
    }

    @Override
    public int getItemCount() {
        return cartBean.getItems().stream()
            .mapToInt(CartItem::getQuantity)
            .sum();
    }
}
