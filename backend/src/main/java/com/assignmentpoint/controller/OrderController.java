package com.assignmentpoint.controller;

import com.assignmentpoint.dto.CreateOrderRequest;
import com.assignmentpoint.dto.OrderDTO;
import com.assignmentpoint.entity.Order;
import com.assignmentpoint.service.OrderService;
import com.assignmentpoint.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<OrderDTO>> createOrder(
            @RequestParam Long customerId,
            @Valid @RequestBody CreateOrderRequest request) {
        OrderDTO order = orderService.createOrder(customerId, request);
        return ResponseEntity.ok(ApiResponse.success("Order created successfully", order));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrder(@PathVariable Long id) {
        OrderDTO order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success("Order retrieved", order));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved", orders));
    }
    
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getAvailableOrders() {
        List<OrderDTO> orders = orderService.getAvailableOrders();
        return ResponseEntity.ok(ApiResponse.success("Available orders retrieved", orders));
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getOrdersByCustomer(@PathVariable Long customerId) {
        List<OrderDTO> orders = orderService.getOrdersByCustomer(customerId);
        return ResponseEntity.ok(ApiResponse.success("Customer orders retrieved", orders));
    }
    
    @GetMapping("/writer/{writerId}")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getOrdersByWriter(@PathVariable Long writerId) {
        List<OrderDTO> orders = orderService.getOrdersByWriter(writerId);
        return ResponseEntity.ok(ApiResponse.success("Writer orders retrieved", orders));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDTO>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
        OrderDTO order = orderService.updateOrderStatus(id, orderStatus);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", order));
    }
    
    @PostMapping("/{orderId}/assign-writer")
    public ResponseEntity<ApiResponse<OrderDTO>> assignWriter(
            @PathVariable Long orderId,
            @RequestParam Long writerId) {
        OrderDTO order = orderService.assignWriter(orderId, writerId);
        return ResponseEntity.ok(ApiResponse.success("Writer assigned to order", order));
    }
}
