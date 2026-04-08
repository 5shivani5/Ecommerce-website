package app.ecom.order.controller;

import app.ecom.order.dto.OrderResponseDTO;
import app.ecom.order.entity.Order;
import app.ecom.order.repository.OrderRepository;
import app.ecom.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*") // optional for frontend
public class AdminController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/orders")
    public List<OrderResponseDTO> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/orders/{id}/status")
    public OrderResponseDTO updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return orderService.updateOrderStatus(id, status);
    }
}