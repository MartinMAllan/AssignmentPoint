package com.assignmentpoint.controller;

import com.assignmentpoint.dto.CreateOrderRequest;
import com.assignmentpoint.dto.OrderDTO;
import com.assignmentpoint.entity.Order;
import com.assignmentpoint.service.OrderService;
import com.assignmentpoint.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<OrderDTO>> createOrder(
        @Valid @RequestBody CreateOrderRequest request,
        @RequestAttribute("userId") Long customerId) {
        OrderDTO order = orderService.createOrder(request, customerId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse<>(true, "Order created successfully", order));
    }
    
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> getAvailableOrders(Pageable pageable) {
        Page<OrderDTO> orders = orderService.getAvailableOrders(pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Available orders retrieved", orders));
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrder(@PathVariable Long orderId) {
        OrderDTO order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order retrieved", order));
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> getCustomerOrders(
        @PathVariable Long customerId,
        Pageable pageable) {
        Page<OrderDTO> orders = orderService.getOrdersByCustomer(customerId, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Customer orders retrieved", orders));
    }
    
    @GetMapping("/writer/{writerId}")
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> getWriterOrders(
        @PathVariable Long writerId,
        Pageable pageable) {
        Page<OrderDTO> orders = orderService.getOrdersByWriter(writerId, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Writer orders retrieved", orders));
    }
    
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderDTO>> updateOrderStatus(
        @PathVariable Long orderId,
        @RequestParam Order.OrderStatus status) {
        OrderDTO order = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order status updated", order));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> searchOrders(
        @RequestParam(required = false) String subject,
        @RequestParam(required = false) String educationLevel,
        Pageable pageable) {
        Page<OrderDTO> orders = orderService.searchOrders(subject, educationLevel, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Orders found", orders));
    }
}
