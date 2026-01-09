# REST Controllers and DTOs

## AuthController.java

```java
package com.writersadmin.controller;

import com.writersadmin.dto.request.LoginRequest;
import com.writersadmin.dto.request.RegisterRequest;
import com.writersadmin.dto.response.ApiResponse;
import com.writersadmin.dto.response.LoginResponse;
import com.writersadmin.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<LoginResponse>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            LoginResponse response = authService.register(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Registration successful", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Invalid credentials", null));
        }
    }
}
```

## OrderController.java

```java
package com.writersadmin.controller;

import com.writersadmin.dto.request.CreateOrderRequest;
import com.writersadmin.dto.response.ApiResponse;
import com.writersadmin.dto.response.OrderResponse;
import com.writersadmin.entity.Order;
import com.writersadmin.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            Authentication authentication) {
        try {
            OrderResponse response = orderService.createOrder(request, authentication.getName());
            return ResponseEntity.ok(new ApiResponse<>(true, "Order created successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAvailableOrders() {
        List<OrderResponse> orders = orderService.getAvailableOrders();
        return ResponseEntity.ok(new ApiResponse<>(true, "Orders retrieved successfully", orders));
    }
    
    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(Authentication authentication) {
        // Implementation depends on user role
        return ResponseEntity.ok(new ApiResponse<>(true, "Orders retrieved successfully", null));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        try {
            OrderResponse response = orderService.getOrderById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Order retrieved successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status);
            OrderResponse response = orderService.updateOrderStatus(id, orderStatus);
            return ResponseEntity.ok(new ApiResponse<>(true, "Order status updated successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
```

## BidController.java

```java
package com.writersadmin.controller;

import com.writersadmin.dto.request.CreateBidRequest;
import com.writersadmin.dto.response.ApiResponse;
import com.writersadmin.dto.response.BidResponse;
import com.writersadmin.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BidController {
    
    private final BidService bidService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<BidResponse>> createBid(
            @Valid @RequestBody CreateBidRequest request,
            Authentication authentication) {
        try {
            BidResponse response = bidService.createBid(request, authentication.getName());
            return ResponseEntity.ok(new ApiResponse<>(true, "Bid submitted successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<BidResponse>>> getBidsByOrder(@PathVariable Long orderId) {
        List<BidResponse> bids = bidService.getBidsByOrder(orderId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bids retrieved successfully", bids));
    }
    
    @PostMapping("/{bidId}/accept")
    public ResponseEntity<ApiResponse<BidResponse>> acceptBid(
            @PathVariable Long bidId,
            Authentication authentication) {
        try {
            BidResponse response = bidService.acceptBid(bidId, authentication.getName());
            return ResponseEntity.ok(new ApiResponse<>(true, "Bid accepted successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
```

## DTOs

### Request DTOs

```java
// LoginRequest.java
package com.writersadmin.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
}

// RegisterRequest.java
package com.writersadmin.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank @Email
    private String email;
    
    @NotBlank
    private String password;
    
    @NotBlank
    private String role;
    
    @NotBlank
    private String firstName;
    
    @NotBlank
    private String lastName;
    
    private String phone;
    private String referralCode;
}

// CreateOrderRequest.java
package com.writersadmin.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CreateOrderRequest {
    @NotBlank
    private String title;
    
    private String topic;
    
    @NotBlank
    private String description;
    
    private String type;
    private String educationLevel;
    private String subject;
    private Integer pagesOrSlides;
    private Integer words;
    private Integer sourcesRequired;
    private String citationStyle;
    private String language;
    private String spacing;
    
    @NotNull
    private BigDecimal budget;
    
    @NotNull
    private LocalDateTime deadline;
    
    private Integer deliveryTime;
}

// CreateBidRequest.java
package com.writersadmin.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateBidRequest {
    @NotNull
    private Long orderId;
    
    @NotBlank
    private String coverLetter;
}
```

### Response DTOs

```java
// LoginResponse.java
package com.writersadmin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Long userId;
    private String email;
    private String role;
    private String firstName;
    private String lastName;
}

// OrderResponse.java
package com.writersadmin.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private String title;
    private String subject;
    private String status;
    private BigDecimal totalAmount;
    private LocalDateTime deadline;
    private Integer deliveryTime;
    private Integer totalBids;
    private LocalDateTime createdAt;
}

// BidResponse.java
package com.writersadmin.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BidResponse {
    private Long id;
    private Long orderId;
    private Long writerId;
    private String writerName;
    private BigDecimal bidAmount;
    private BigDecimal proposedWriterShare;
    private String coverLetter;
    private String status;
    private LocalDateTime submittedAt;
}

// ApiResponse.java
package com.writersadmin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private Boolean success;
    private String message;
    private T data;
}
```

## Additional Services

```java
// RevenueService.java
package com.writersadmin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class RevenueService {
    
    public BigDecimal calculateWriterEarnings(BigDecimal orderAmount, Boolean isReturningCustomer) {
        BigDecimal percentage = isReturningCustomer ? 
                new BigDecimal("45.00") : new BigDecimal("40.00");
        return orderAmount.multiply(percentage)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
    }
    
    public BigDecimal calculateSalesAgentCommission(BigDecimal orderAmount, Boolean isReturningCustomer) {
        BigDecimal percentage = isReturningCustomer ? 
                new BigDecimal("5.00") : new BigDecimal("10.00");
        return orderAmount.multiply(percentage)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
    }
    
    public BigDecimal calculateEditorEarnings(BigDecimal orderAmount) {
        return orderAmount.multiply(new BigDecimal("5.00"))
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
    }
    
    public BigDecimal calculateManagerEarnings(BigDecimal orderAmount) {
        return orderAmount.multiply(new BigDecimal("5.00"))
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
    }
}
```

## Exception Handling

```java
// GlobalExceptionHandler.java
package com.writersadmin.exception;

import com.writersadmin.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }
    
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }
    
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(BadRequestException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "An error occurred: " + ex.getMessage(), null));
    }
}

// Custom Exceptions
package com.writersadmin.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
