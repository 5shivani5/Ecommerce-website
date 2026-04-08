package app.ecom.order.controller;

import app.ecom.order.dto.OrderRequestDTO;
import app.ecom.order.dto.OrderResponseDTO;
import app.ecom.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    // ✅ FIXED
    @PostMapping("/place")
    public ResponseEntity<OrderResponseDTO> placeOrder(@RequestBody OrderRequestDTO request) {
        return ResponseEntity.ok(orderService.placeOrder(request));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponseDTO> cancelOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.cancelOrder(orderId));
    }
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponseDTO> updateStatus(
            @PathVariable Long orderId,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}