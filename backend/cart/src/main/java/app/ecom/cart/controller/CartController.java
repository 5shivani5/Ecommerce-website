package app.ecom.cart.controller;

import app.ecom.cart.bean.CartBean;
import app.ecom.cart.dto.CartRequestDTO;
import app.ecom.cart.dto.CartResponseDTO;
import app.ecom.cart.service.CartService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173",
             allowCredentials = "true")
public class CartController {

    @Autowired
    private CartService cartService;

    @PutMapping("/update/{productId}")
    public ResponseEntity<CartResponseDTO> updateQuantity(
            @PathVariable String productId,
            @RequestParam int quantity) {
        return ResponseEntity.ok(
            CartResponseDTO.from(
                cartService.updateQuantity(productId, quantity),
                "Cart updated successfully"));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<CartResponseDTO> removeItem(
            @PathVariable String productId) {
        return ResponseEntity.ok(
            CartResponseDTO.from(
                cartService.removeItem(productId),
                "Item removed from cart"));
    }
    @PostMapping("/add")
    public ResponseEntity<CartResponseDTO> addToCart(@RequestBody CartRequestDTO request) {
        System.out.println("CartRequestDTO received: " + request.getProductId() + ", " + request.getProductName() + ", " + request.getPrice());
        CartBean cart = cartService.addItem(request);
        return ResponseEntity.ok(CartResponseDTO.from(cart, "Item added to cart"));
    }
    @DeleteMapping("/clear")
    public ResponseEntity<CartResponseDTO> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok(
            CartResponseDTO.from(
                cartService.getCart(),
                "Cart cleared successfully"));
    }
    @GetMapping("/")
    public ResponseEntity<CartResponseDTO> getCart() {
        CartBean cart = cartService.getCart();
        if (cart == null) {
            // Return an empty cart instead of throwing 500
            cart = new CartBean();
        }
        return ResponseEntity.ok(CartResponseDTO.from(cart, "Cart retrieved successfully"));
    }
    @GetMapping("/count")
    public ResponseEntity<Integer> getItemCount() {
        return ResponseEntity.ok(cartService.getItemCount());
    }
}
