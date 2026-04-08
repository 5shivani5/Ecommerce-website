package app.ecom.order.service.impl;

import app.ecom.order.dto.OrderRequestDTO;
import app.ecom.order.dto.OrderResponseDTO;
import app.ecom.order.entity.Order;
import app.ecom.order.entity.OrderItem;
import app.ecom.order.exception.OrderNotFoundException;
import app.ecom.order.repository.OrderRepository;
import app.ecom.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private static final String PRODUCT_SERVICE_URL = "http://localhost:8082/products";
    private static final String PAYMENT_SERVICE_URL = "http://localhost:8083/payment";

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public OrderResponseDTO placeOrder(OrderRequestDTO request) {

        // ✅ Create Order
        Order order = new Order(
                request.getUserId(),
                request.getUsername(),
                request.getTotalAmount(),
                request.getAddressLine(),
                request.getCity(),
                request.getState(),
                request.getPincode()
        );

        // ✅ ADD ITEMS (FIXED)
        if (request.getItems() != null) {
            for (OrderRequestDTO.ItemDTO dto : request.getItems()) {

                OrderItem item = new OrderItem(
                        dto.getProductId(),   // make sure this is Long
                        dto.getProductName(),
                        dto.getBrand(),
                        dto.getImageUrl(),
                        dto.getPrice(),
                        dto.getQuantity(),
                        order
                );

                // 🔥 IMPORTANT FIX
                order.addItem(item);
            }
        }

        // ✅ Save order (will also save items because of cascade)
        Order saved = orderRepository.save(order);

        // ✅ Reduce stock
        if (request.getItems() != null) {
            for (OrderRequestDTO.ItemDTO dto : request.getItems()) {
                try {
                    String url = PRODUCT_SERVICE_URL + "/" + dto.getProductId()
                            + "/reduce-stock?qty=" + dto.getQuantity();
                    restTemplate.put(url, null);
                } catch (Exception e) {
                    e.printStackTrace();

                }
            }
        }

        return OrderResponseDTO.from(saved, "Order placed successfully!");
    }

    @Override
    public List<OrderResponseDTO> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(OrderResponseDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponseDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found: " + orderId));
        return OrderResponseDTO.from(order);
    }

    @Override
    public OrderResponseDTO cancelOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found: " + orderId));

        if ("DELIVERED".equals(order.getStatus()) ||
                "TRANSIT".equals(order.getStatus())) {

            throw new IllegalStateException("Order cannot be cancelled at this stage");
        }

        if ("CANCELLED".equals(order.getStatus())) {
            throw new IllegalStateException("Order is already cancelled");
        }

        order.setStatus("CANCELLED");
        Order saved = orderRepository.save(order);

        // Restore stock
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                try {
                    String url = PRODUCT_SERVICE_URL + "/" + item.getProductId()
                            + "/restore-stock?qty=" + item.getQuantity();
                    restTemplate.put(url, null);
                } catch (Exception e) {
                    System.err.println("[WARN] Could not restore stock for product "
                            + item.getProductId() + ": " + e.getMessage());
                }
            }
        }

        // Refund
        try {
            String refundUrl = PAYMENT_SERVICE_URL + "/refund"
                    + "?userId="  + order.getUserId()
                    + "&amount="  + order.getTotalAmount()
                    + "&orderId=" + orderId;

            restTemplate.postForObject(refundUrl, null, Object.class);

            System.out.println("[INFO] Wallet refund OK: userId=" + order.getUserId()
                    + " amount=" + order.getTotalAmount()
                    + " orderId=" + orderId);

        } catch (Exception e) {
            System.err.println("[ERROR] Wallet refund FAILED orderId=" + orderId
                    + " " + e.getMessage());
        }

        return OrderResponseDTO.from(saved, "Order cancelled. Amount refunded to wallet.");
    }
    @Override
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(OrderResponseDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponseDTO updateOrderStatus(Long orderId, String status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found: " + orderId));

        if (order.getStatus().equals("CANCELLED")) {
            throw new IllegalStateException("Cannot update a cancelled order");
        }

        if (order.getStatus().equals("DELIVERED")) {
            throw new IllegalStateException("Order already delivered");
        }

        List<String> allowed = List.of("PLACED", "TRANSIT", "DELIVERED", "CANCELLED");

        if (!allowed.contains(status)) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        order.setStatus(status);
        Order saved = orderRepository.save(order);

        return OrderResponseDTO.from(saved, "Order status updated to " + status);
    }
}