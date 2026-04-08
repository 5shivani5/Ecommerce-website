package app.ecom.order.repository;

import app.ecom.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Matches GET /orders/user/{userId} called by orderApi.js
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
