# Services and Controllers

This document contains key service implementations and REST controllers. Due to length, I'll provide the most important ones with patterns you can replicate for others.

## AuthService.java

```java
package com.writersadmin.service;

import com.writersadmin.dto.request.LoginRequest;
import com.writersadmin.dto.request.RegisterRequest;
import com.writersadmin.dto.response.LoginResponse;
import com.writersadmin.entity.*;
import com.writersadmin.repository.*;
import com.writersadmin.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final WriterRepository writerRepository;
    private final CustomerRepository customerRepository;
    private final SalesAgentRepository salesAgentRepository;
    private final EditorRepository editorRepository;
    private final WriterManagerRepository writerManagerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    
    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.UserRole.valueOf(request.getRole()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setIsActive(true);
        user.setIsEmailVerified(false);
        
        user = userRepository.save(user);
        
        // Create role-specific entity
        createRoleSpecificEntity(user, request);
        
        // Generate token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        String token = jwtTokenProvider.generateToken(authentication);
        
        return new LoginResponse(token, user.getId(), user.getEmail(), user.getRole().name(), 
                user.getFirstName(), user.getLastName());
    }
    
    private void createRoleSpecificEntity(User user, RegisterRequest request) {
        switch (user.getRole()) {
            case writer:
                Writer writer = new Writer();
                writer.setUser(user);
                writerRepository.save(writer);
                break;
            case customer:
                Customer customer = new Customer();
                customer.setUser(user);
                if (request.getReferralCode() != null) {
                    SalesAgent agent = salesAgentRepository.findByReferralCode(request.getReferralCode())
                            .orElseThrow(() -> new RuntimeException("Invalid referral code"));
                    customer.setSalesAgent(agent);
                    customer.setReferralCodeUsed(request.getReferralCode());
                }
                customerRepository.save(customer);
                break;
            case sales_agent:
                SalesAgent agent = new SalesAgent();
                agent.setUser(user);
                agent.setReferralCode(generateReferralCode());
                salesAgentRepository.save(agent);
                break;
            case editor:
                Editor editor = new Editor();
                editor.setUser(user);
                editorRepository.save(editor);
                break;
            case writer_manager:
                WriterManager manager = new WriterManager();
                manager.setUser(user);
                writerManagerRepository.save(manager);
                break;
        }
    }
    
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        String token = jwtTokenProvider.generateToken(authentication);
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new LoginResponse(token, user.getId(), user.getEmail(), user.getRole().name(),
                user.getFirstName(), user.getLastName());
    }
    
    private String generateReferralCode() {
        return "REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
```

## OrderService.java

```java
package com.writersadmin.service;

import com.writersadmin.dto.request.CreateOrderRequest;
import com.writersadmin.dto.response.OrderResponse;
import com.writersadmin.entity.*;
import com.writersadmin.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Customer customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));
        
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setCustomer(customer);
        order.setTitle(request.getTitle());
        order.setTopic(request.getTopic());
        order.setDescription(request.getDescription());
        order.setType(request.getType());
        order.setEducationLevel(request.getEducationLevel());
        order.setSubject(request.getSubject());
        order.setPagesOrSlides(request.getPagesOrSlides());
        order.setWords(request.getWords());
        order.setSourcesRequired(request.getSourcesRequired());
        order.setCitationStyle(request.getCitationStyle());
        order.setLanguage(request.getLanguage());
        order.setSpacing(request.getSpacing());
        order.setTotalAmount(request.getBudget());
        order.setDeadline(request.getDeadline());
        order.setDeliveryTime(request.getDeliveryTime());
        order.setStatus(Order.OrderStatus.available);
        order.setCustomerIsReturning(customer.getIsReturning());
        
        if (customer.getSalesAgent() != null) {
            order.setSalesAgent(customer.getSalesAgent());
        }
        
        order = orderRepository.save(order);
        
        return mapToOrderResponse(order);
    }
    
    public List<OrderResponse> getAvailableOrders() {
        return orderRepository.findAvailableOrders().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }
    
    public List<OrderResponse> getOrdersByWriter(Long writerId) {
        return orderRepository.findByWriterId(writerId).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }
    
    public List<OrderResponse> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }
    
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToOrderResponse(order);
    }
    
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(status);
        
        if (status == Order.OrderStatus.in_progress && order.getStartedAt() == null) {
            order.setStartedAt(LocalDateTime.now());
        } else if (status == Order.OrderStatus.completed) {
            order.setCompletedAt(LocalDateTime.now());
        }
        
        order = orderRepository.save(order);
        return mapToOrderResponse(order);
    }
    
    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setTitle(order.getTitle());
        response.setSubject(order.getSubject());
        response.setStatus(order.getStatus().name());
        response.setTotalAmount(order.getTotalAmount());
        response.setDeadline(order.getDeadline());
        response.setDeliveryTime(order.getDeliveryTime());
        response.setTotalBids(order.getTotalBids());
        response.setCreatedAt(order.getCreatedAt());
        // Add more fields as needed
        return response;
    }
}
```

## BidService.java

```java
package com.writersadmin.service;

import com.writersadmin.dto.request.CreateBidRequest;
import com.writersadmin.dto.response.BidResponse;
import com.writersadmin.entity.*;
import com.writersadmin.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BidService {
    
    private final OrderBidRepository bidRepository;
    private final OrderRepository orderRepository;
    private final WriterRepository writerRepository;
    private final UserRepository userRepository;
    private final RevenueService revenueService;
    
    @Transactional
    public BidResponse createBid(CreateBidRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Writer writer = writerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Writer profile not found"));
        
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Check if writer already bid on this order
        if (bidRepository.findByOrderIdAndWriterId(order.getId(), writer.getId()).isPresent()) {
            throw new RuntimeException("You have already submitted a bid for this order");
        }
        
        OrderBid bid = new OrderBid();
        bid.setOrder(order);
        bid.setWriter(writer);
        bid.setBidAmount(order.getTotalAmount()); // Use customer's budget
        bid.setDeliveryTime(order.getDeliveryTime()); // Use customer's delivery time
        bid.setCoverLetter(request.getCoverLetter());
        bid.setSubmittedAt(LocalDateTime.now());
        bid.setStatus(OrderBid.BidStatus.pending);
        
        // Calculate writer's proposed share
        BigDecimal writerShare = revenueService.calculateWriterEarnings(
                order.getTotalAmount(), 
                order.getCustomerIsReturning()
        );
        bid.setProposedWriterShare(writerShare);
        
        bid = bidRepository.save(bid);
        
        // Update order bid count
        order.setTotalBids(order.getTotalBids() + 1);
        orderRepository.save(order);
        
        // Update writer stats
        writer.setTotalBidsSubmitted(writer.getTotalBidsSubmitted() + 1);
        writerRepository.save(writer);
        
        return mapToBidResponse(bid);
    }
    
    public List<BidResponse> getBidsByOrder(Long orderId) {
        return bidRepository.findByOrderId(orderId).stream()
                .map(this::mapToBidResponse)
                .collect(Collectors.toList());
    }
    
    public List<BidResponse> getBidsByWriter(Long writerId) {
        return bidRepository.findByWriterId(writerId).stream()
                .map(this::mapToBidResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public BidResponse acceptBid(Long bidId, String userEmail) {
        OrderBid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));
        
        Order order = bid.getOrder();
        
        // Verify user is the customer
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!order.getCustomer().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Only the customer can accept bids");
        }
        
        // Update bid status
        bid.setStatus(OrderBid.BidStatus.accepted);
        bid.setReviewedAt(LocalDateTime.now());
        bid.setReviewedBy(user);
        bid = bidRepository.save(bid);
        
        // Update order
        order.setWriter(bid.getWriter());
        order.setWinningBid(bid);
        order.setStatus(Order.OrderStatus.in_progress);
        order.setStartedAt(LocalDateTime.now());
        orderRepository.save(order);
        
        // Reject other pending bids
        List<OrderBid> otherBids = bidRepository.findByOrderIdAndStatus(order.getId(), OrderBid.BidStatus.pending);
        for (OrderBid otherBid : otherBids) {
            if (!otherBid.getId().equals(bidId)) {
                otherBid.setStatus(OrderBid.BidStatus.rejected);
                otherBid.setRejectionReason("Another bid was accepted");
                bidRepository.save(otherBid);
            }
        }
        
        // Update writer stats
        Writer writer = bid.getWriter();
        writer.setTotalBidsWon(writer.getTotalBidsWon() + 1);
        writerRepository.save(writer);
        
        return mapToBidResponse(bid);
    }
    
    private BidResponse mapToBidResponse(OrderBid bid) {
        BidResponse response = new BidResponse();
        response.setId(bid.getId());
        response.setOrderId(bid.getOrder().getId());
        response.setWriterId(bid.getWriter().getId());
        response.setWriterName(bid.getWriter().getUser().getFirstName() + " " + bid.getWriter().getUser().getLastName());
        response.setBidAmount(bid.getBidAmount());
        response.setProposedWriterShare(bid.getProposedWriterShare());
        response.setCoverLetter(bid.getCoverLetter());
        response.setStatus(bid.getStatus().name());
        response.setSubmittedAt(bid.getSubmittedAt());
        return response;
    }
}
```

## Controllers follow the same pattern. See next section...
