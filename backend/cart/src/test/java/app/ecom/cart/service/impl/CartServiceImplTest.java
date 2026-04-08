package app.ecom.cart.service.impl;

import app.ecom.cart.bean.CartBean;
import app.ecom.cart.dto.CartRequestDTO;
import app.ecom.cart.model.CartItem;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CartServiceImplTest {

    @Autowired
    private CartServiceImpl cartService;

    private CartRequestDTO product(String id, String name,
                                   double price, int qty) {
        CartRequestDTO dto = new CartRequestDTO();
        dto.setProductId(id);
        dto.setProductName(name);
        dto.setBrand("TestBrand");
        dto.setImageUrl("https://example.com/img.jpg");
        dto.setPrice(price);
        dto.setQuantity(qty);
        return dto;
    }

    @Test @Order(1)
    @DisplayName("1. Empty cart on start")
    void emptyCart() {
        CartBean cart = cartService.getCart();
        assertTrue(cart.getItems().isEmpty());
        assertEquals(0.0, cart.getTotalAmount());
        System.out.println("✅ TEST 1 PASSED — Empty cart");
    }

    @Test @Order(2)
    @DisplayName("2. Add item to cart")
    void addItem() {
        CartBean cart = cartService.addItem(
            product("p1", "Floral Dress", 1299, 1));
        assertFalse(cart.getItems().isEmpty());
        assertEquals(1299.0, cart.getTotalAmount(), 0.01);
        System.out.println("✅ TEST 2 PASSED — Item added ₹"
            + cart.getTotalAmount());
    }

    @Test @Order(3)
    @DisplayName("3. Add same product increases quantity")
    void addSameProduct() {
        cartService.addItem(product("p1", "Floral Dress", 1299, 1));
        CartBean cart = cartService.addItem(
            product("p1", "Floral Dress", 1299, 1));
        CartItem item = cart.getItems().stream()
            .filter(i -> i.getProductId().equals("p1"))
            .findFirst().orElse(null);
        assertNotNull(item);
        assertTrue(item.getQuantity() >= 2);
        System.out.println("✅ TEST 3 PASSED — Quantity increased to "
            + item.getQuantity());
    }

    @Test @Order(4)
    @DisplayName("4. Update quantity")
    void updateQty() {
        cartService.addItem(product("p2", "Cotton Kurti", 599, 1));
        CartBean cart = cartService.updateQuantity("p2", 3);
        CartItem item = cart.getItems().stream()
            .filter(i -> i.getProductId().equals("p2"))
            .findFirst().orElse(null);
        assertNotNull(item);
        assertEquals(3, item.getQuantity());
        System.out.println("✅ TEST 4 PASSED — Qty updated to 3");
    }

    @Test @Order(5)
    @DisplayName("5. Remove item")
    void removeItem() {
        cartService.addItem(product("p3", "Slim Jeans", 2499, 1));
        int sizeBefore = cartService.getCart().getItems().size();
        cartService.removeItem("p3");
        int sizeAfter = cartService.getCart().getItems().size();
        assertEquals(sizeBefore - 1, sizeAfter);
        System.out.println("✅ TEST 5 PASSED — Item removed");
    }

    @Test @Order(6)
    @DisplayName("6. Clear cart")
    void clearCart() {
        cartService.clearCart();
        assertTrue(cartService.getCart().getItems().isEmpty());
        assertEquals(0.0, cartService.getCart().getTotalAmount());
        System.out.println("✅ TEST 6 PASSED — Cart cleared");
    }
}
