package app.ecom.order.service;

import app.ecom.order.dto.OrderRequestDTO;
import app.ecom.order.dto.OrderResponseDTO;
import java.util.List;

public interface OrderService {
    OrderResponseDTO       placeOrder(OrderRequestDTO request);
    List<OrderResponseDTO> getOrdersByUserId(Long userId);
    OrderResponseDTO       getOrderById(Long orderId);
    OrderResponseDTO       cancelOrder(Long orderId);
    List<OrderResponseDTO> getAllOrders();
    OrderResponseDTO updateOrderStatus(Long orderId, String status);


}
