package app.ecom.order.service.impl;

    import app.ecom.order.dto.OrderRequestDTO;
import app.ecom.order.dto.OrderResponseDTO;
import app.ecom.order.entity.Order;
import app.ecom.order.entity.OrderItem;
import app.ecom.order.exception.OrderNotFoundException;
import app.ecom.order.repository.OrderRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

    @ExtendWith(MockitoExtension.class)
    class OrderServiceImplTest {

        @Mock
        private OrderRepository orderRepository;

        @Mock
        private RestTemplate restTemplate;

        @InjectMocks
        private OrderServiceImpl orderService;

        // Helper: builds the request DTO (what the frontend sends)
        private OrderRequestDTO buildRequest(boolean withItems) {
            OrderRequestDTO req = new OrderRequestDTO();
            req.setUserId(1L);
            req.setUsername("priya");
            req.setTotalAmount(3798.0);
            req.setAddressLine("12, Anna Nagar");
            req.setCity("Chennai");
            req.setState("Tamil Nadu");
            req.setPincode("600040");

            if (withItems) {
                OrderRequestDTO.ItemDTO item1 = new OrderRequestDTO.ItemDTO();
                item1.setProductId(1L);
                item1.setProductName("Floral Dress");
                item1.setBrand("UrbanVogue");
                item1.setImageUrl("https://example.com/img1.jpg");
                item1.setPrice(1299.0);
                item1.setQuantity(1);

                OrderRequestDTO.ItemDTO item2 = new OrderRequestDTO.ItemDTO();
                item2.setProductId(2L);
                item2.setProductName("Slim Jeans");
                item2.setBrand("UrbanVogue");
                item2.setImageUrl("https://example.com/img2.jpg");
                item2.setPrice(2499.0);
                item2.setQuantity(1);

                req.setItems(Arrays.asList(item1, item2));
            }

            return req;
        }

        //  Helper: builds a saved Order (what the DB returns)
        private Order buildSavedOrder(String status) {
            Order order = new Order(1L, "priya", 3798.0,
                    "12, Anna Nagar", "Chennai", "Tamil Nadu", "600040");
            order.setId(101L);
            order.setStatus(status);

            OrderItem i1 = new OrderItem(1L, "Floral Dress", "UrbanVogue",
                    "https://example.com/img1.jpg", 1299.0, 1, order);
            OrderItem i2 = new OrderItem(2L, "Slim Jeans", "UrbanVogue",
                    "https://example.com/img2.jpg", 2499.0, 1, order);
            order.setItems(new ArrayList<>(Arrays.asList(i1, i2)));

            return order;
        }

        @Test
        @DisplayName("Place order successfully")
        void placeOrder_shouldSaveAndReturnPlacedStatus() {
            when(orderRepository.save(any(Order.class))).thenReturn(buildSavedOrder("PLACED"));

            OrderResponseDTO result = orderService.placeOrder(buildRequest(true));

            assertNotNull(result);
            assertEquals("PLACED", result.getStatus());
            assertEquals(101L, result.getId());
            assertEquals(1L, result.getUserId());
            assertEquals("priya", result.getUsername());
            assertEquals(3798.0, result.getTotalAmount(), 0.01);
            assertEquals("Order placed successfully!", result.getMessage());
            verify(orderRepository, times(1)).save(any(Order.class));
        }

        @Test
        @DisplayName(" Reduce stock for each item")
        void placeOrder_shouldCallReduceStock_forEachItem() {
            when(orderRepository.save(any(Order.class))).thenReturn(buildSavedOrder("PLACED"));

            orderService.placeOrder(buildRequest(true));

            verify(restTemplate, times(2)).put(anyString(), isNull());
        }


        @Test
        @DisplayName("Get order by ID successfully")
        void getOrderById_shouldReturnOrder_whenFound() {
            when(orderRepository.findById(101L)).thenReturn(Optional.of(buildSavedOrder("PLACED")));

            OrderResponseDTO result = orderService.getOrderById(101L);

            assertNotNull(result);
            assertEquals(101L, result.getId());
            assertEquals("PLACED", result.getStatus());
            assertEquals("priya", result.getUsername());
        }

        @Test
        @DisplayName("Throw error when order not found")
        void getOrderById_shouldThrowOrderNotFoundException_whenNotFound() {
            when(orderRepository.findById(999L)).thenReturn(Optional.empty());

            OrderNotFoundException ex = assertThrows(
                    OrderNotFoundException.class,
                    () -> orderService.getOrderById(999L)
            );

            assertTrue(ex.getMessage().contains("999"));
        }

        @Test
        @DisplayName("Get all orders for a user")
        void getOrdersByUserId_shouldReturnAllOrders_forUser() {
            Order o1 = buildSavedOrder("PLACED");    o1.setId(101L);
            Order o2 = buildSavedOrder("DELIVERED"); o2.setId(102L);
            when(orderRepository.findByUserIdOrderByCreatedAtDesc(1L))
                    .thenReturn(Arrays.asList(o1, o2));

            List<OrderResponseDTO> results = orderService.getOrdersByUserId(1L);

            assertEquals(2, results.size());
            assertEquals(101L, results.get(0).getId());
            assertEquals(102L, results.get(1).getId());
            assertEquals("PLACED",    results.get(0).getStatus());
            assertEquals("DELIVERED", results.get(1).getStatus());
        }

        @Test
        @DisplayName("Return empty list when user has no orders")
        void getOrdersByUserId_shouldReturnEmptyList_whenNoOrders() {
            when(orderRepository.findByUserIdOrderByCreatedAtDesc(42L))
                    .thenReturn(new ArrayList<>());

            List<OrderResponseDTO> results = orderService.getOrdersByUserId(42L);

            assertNotNull(results);
            assertTrue(results.isEmpty());
        }

        @Test
        @DisplayName("Cancel order successfully")
        void cancelOrder_shouldReturnCancelledStatus_whenPlaced() {
            when(orderRepository.findById(101L)).thenReturn(Optional.of(buildSavedOrder("PLACED")));
            when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

            OrderResponseDTO result = orderService.cancelOrder(101L);

            assertEquals("CANCELLED", result.getStatus());
            assertTrue(result.getMessage().contains("cancelled"));
            verify(orderRepository, times(1)).save(any(Order.class));
        }

        @Test
        @DisplayName("Call payment service for refund")
        void cancelOrder_shouldCallRefund_toPaymentService() {
            when(orderRepository.findById(101L)).thenReturn(Optional.of(buildSavedOrder("PLACED")));
            when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

            orderService.cancelOrder(101L);

            verify(restTemplate, times(1))
                    .postForObject(anyString(), isNull(), eq(Object.class));
        }

        @Test
        @DisplayName("Restore stock for each item")
        void cancelOrder_shouldCallRestoreStock_forEachItem() {
            when(orderRepository.findById(101L)).thenReturn(Optional.of(buildSavedOrder("PLACED")));
            when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

            orderService.cancelOrder(101L);

            verify(restTemplate, times(2)).put(anyString(), isNull());
        }

        @Test
        @DisplayName("Cannot cancel delivered order")
        void cancelOrder_shouldThrow_whenStatusIsDelivered() {
            when(orderRepository.findById(101L)).thenReturn(Optional.of(buildSavedOrder("DELIVERED")));

            assertThrows(IllegalStateException.class, () -> orderService.cancelOrder(101L));

            verify(orderRepository, never()).save(any());
        }

        @Test
        @DisplayName("Cannot cancel already cancelled order")
        void cancelOrder_shouldThrow_whenAlreadyCancelled() {
            when(orderRepository.findById(101L)).thenReturn(Optional.of(buildSavedOrder("CANCELLED")));

            assertThrows(IllegalStateException.class, () -> orderService.cancelOrder(101L));
        }

        @Test
        @DisplayName("Throw error when cancelling non-existing order")
        void cancelOrder_shouldThrowOrderNotFoundException_whenOrderNotFound() {
            when(orderRepository.findById(999L)).thenReturn(Optional.empty());

            assertThrows(OrderNotFoundException.class, () -> orderService.cancelOrder(999L));
        }


    }

