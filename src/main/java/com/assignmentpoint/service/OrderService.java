package com.assignmentpoint.service;

import com.assignmentpoint.dto.CreateOrderRequest;
import com.assignmentpoint.dto.OrderDTO;
import com.assignmentpoint.entity.*;
import com.assignmentpoint.exception.ResourceNotFoundException;
import com.assignmentpoint.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final WriterRepository writerRepository;
    private final OrderBidRepository orderBidRepository;
    
    public OrderDTO createOrder(CreateOrderRequest request, Long customerId) {
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        
        Order order = Order.builder()
            .orderNumber(generateOrderNumber())
            .customer(customer)
            .title(request.getTitle())
            .topic(request.getTopic())
            .description(request.getDescription())
            .type(request.getType())
            .educationLevel(request.getEducationLevel())
            .subject(request.getSubject())
            .pagesOrSlides(request.getPagesOrSlides())
            .words(request.getWords())
            .sourcesRequired(request.getSourcesRequired())
            .citationStyle(request.getCitationStyle())
            .language(request.getLanguage())
            .spacing(request.getSpacing())
            .totalAmount(request.getTotalAmount())
            .currency(request.getCurrency())
            .deadline(request.getDeadline())
            .deliveryTime(request.getDeliveryTime())
            .status(Order.OrderStatus.AVAILABLE)
            .customerIsReturning(customer.getIsReturning())
            .build();
        
        order = orderRepository.save(order);
        return convertToDTO(order);
    }
    
    public Page<OrderDTO> getAvailableOrders(Pageable pageable) {
        return orderRepository.findAvailableOrders(pageable)
            .map(this::convertToDTO);
    }
    
    public Page<OrderDTO> getOrdersByCustomer(Long customerId, Pageable pageable) {
        return orderRepository.findByCustomerId(customerId, pageable)
            .map(this::convertToDTO);
    }
    
    public Page<OrderDTO> getOrdersByWriter(Long writerId, Pageable pageable) {
        return orderRepository.findByWriterId(writerId, pageable)
            .map(this::convertToDTO);
    }
    
    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return convertToDTO(order);
    }
    
    public OrderDTO updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        order.setStatus(status);
        if (status == Order.OrderStatus.IN_PROGRESS) {
            order.setStartedAt(LocalDateTime.now());
        } else if (status == Order.OrderStatus.COMPLETED) {
            order.setCompletedAt(LocalDateTime.now());
        }
        
        order = orderRepository.save(order);
        return convertToDTO(order);
    }
    
    public Page<OrderDTO> searchOrders(String subject, String educationLevel, Pageable pageable) {
        return orderRepository.findBySubjectAndEducationLevel(subject, educationLevel, pageable)
            .map(this::convertToDTO);
    }
    
    private String generateOrderNumber() {
        return "ORD_" + System.currentTimeMillis();
    }
    
    private OrderDTO convertToDTO(Order order) {
        return OrderDTO.builder()
            .id(order.getId())
            .orderNumber(order.getOrderNumber())
            .title(order.getTitle())
            .subject(order.getSubject())
            .educationLevel(order.getEducationLevel())
            .totalAmount(order.getTotalAmount())
            .status(order.getStatus())
            .deadline(order.getDeadline())
            .deliveryTime(order.getDeliveryTime())
            .totalBids(order.getTotalBids())
            .customerId(order.getCustomer().getId())
            .writerId(order.getWriter() != null ? order.getWriter().getId() : null)
            .build();
    }
}
