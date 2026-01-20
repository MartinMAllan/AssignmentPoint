package com.assignmentpoint.controller;

import com.assignmentpoint.dto.CreateOrderRequest;
import com.assignmentpoint.dto.OrderDTO;
import com.assignmentpoint.entity.Customer;
import com.assignmentpoint.entity.Order;
import com.assignmentpoint.exception.UnauthorizedException;
import com.assignmentpoint.repository.CustomerRepository;
import com.assignmentpoint.service.OrderService;
import com.assignmentpoint.security.JwtTokenProvider;
import com.assignmentpoint.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomerRepository customerRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDTO>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @RequestHeader("Authorization") String token) {

        Long userId = Long.parseLong(jwtTokenProvider.getUserIdFromToken(token.replace("Bearer ", "")));
        Long customerId = customerRepository.findByUserId(userId)
                .map(Customer::getId)
                .orElseThrow(() -> new UnauthorizedException("Customer profile not found for this user"));

        System.out.println("[v0] OrderController: Creating order for customerId: " + customerId);
        System.out.println("[v0] OrderController: Request - title: " + request.getTitle());
        System.out.println("[v0] OrderController: Request - pages: " + request.getPages());
        System.out.println("[v0] OrderController: Request - words: " + request.getWords());
        System.out.println("[v0] OrderController: Request - language: " + request.getLanguage());
        System.out.println("[v0] OrderController: Request - spacing: " + request.getSpacing());
        System.out.println("[v0] OrderController: Request - citationStyle: " + request.getCitationStyle());
        System.out.println("[v0] OrderController: Request - sourcesRequired: " + request.getSourcesRequired());
        System.out.println("[v0] OrderController: Request - type: " + request.getType());
        System.out.println("[v0] OrderController: Request - educationLevel: " + request.getEducationLevel());
        System.out.println("[v0] OrderController: Request - totalAmount: " + request.getTotalAmount());
        System.out.println("[v0] OrderController: Request - deadline: " + request.getDeadline());
        System.out.println("[v0] OrderController: Request - deliveryTime: " + request.getDeliveryTime());

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
