package com.assignmentpoint.service;

import com.assignmentpoint.dto.CreateOrderRequest;
import com.assignmentpoint.dto.OrderDTO;
import com.assignmentpoint.entity.*;
import com.assignmentpoint.exception.ResourceNotFoundException;
import com.assignmentpoint.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private WriterRepository writerRepository;
    
    @Transactional
    public OrderDTO createOrder(Long customerId, CreateOrderRequest request) {
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        
        String orderNumber = "ORD" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        Order order = Order.builder()
            .orderNumber(orderNumber)
            .customer(customer)
            .salesAgent(customer.getSalesAgent())
            .title(request.getTitle())
            .description(request.getDescription())
            .type(request.getType())
            .educationLevel(request.getEducationLevel())
            .subject(request.getSubject())
            .pagesOrSlides(request.getPages())
            .words(request.getWords())
            .sourcesRequired(request.getSourcesRequired())
            .citationStyle(request.getCitationStyle())
            .language(request.getLanguage())
            .spacing(request.getSpacing())
            .totalAmount(request.getTotalAmount())
            .deadline(request.getDeadline())
            .deliveryTime(request.getDeliveryTime())
            .customerIsReturning(customer.getIsReturning())
            .status(Order.OrderStatus.AVAILABLE)
            .build();
        
        order = orderRepository.save(order);
        
        customer.setTotalOrders(customer.getTotalOrders() + 1);
        if (!customer.getIsReturning() && customer.getTotalOrders() > 1) {
            customer.setIsReturning(true);
        }
        customerRepository.save(customer);
        
        return convertToDTO(order);
    }
    
    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return convertToDTO(order);
    }
    
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<OrderDTO> getAvailableOrders() {
        return orderRepository.findAvailableOrders().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<OrderDTO> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<OrderDTO> getOrdersByWriter(Long writerId) {
        return orderRepository.findByWriterId(writerId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        order.setStatus(status);
        
        switch (status) {
            case IN_PROGRESS:
                if (order.getStartedAt() == null) {
                    order.setStartedAt(LocalDateTime.now());
                }
                break;
            case IN_REVIEW:
                order.setSubmittedAt(LocalDateTime.now());
                break;
            case COMPLETED:
                order.setCompletedAt(LocalDateTime.now());
                break;
        }
        
        order = orderRepository.save(order);
        return convertToDTO(order);
    }
    
    @Transactional
    public OrderDTO assignWriter(Long orderId, Long writerId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        Writer writer = writerRepository.findById(writerId)
            .orElseThrow(() -> new ResourceNotFoundException("Writer not found"));
        
        order.setWriter(writer);
        order.setWriterManager(writer.getWriterManager());
        order.setStatus(Order.OrderStatus.IN_PROGRESS);
        order.setStartedAt(LocalDateTime.now());
        
        order = orderRepository.save(order);
        return convertToDTO(order);
    }
    
    private OrderDTO convertToDTO(Order order) {
        return OrderDTO.builder()
            .id(order.getId())
            .orderNumber(order.getOrderNumber())
            .customerId(order.getCustomer().getId())
            .customerName(order.getCustomer().getUser().getFirstName() + " " + order.getCustomer().getUser().getLastName())
            .writerId(order.getWriter() != null ? order.getWriter().getId() : null)
            .writerName(order.getWriter() != null ? 
                order.getWriter().getUser().getFirstName() + " " + order.getWriter().getUser().getLastName() : null)
            .editorId(order.getEditor() != null ? order.getEditor().getId() : null)
            .salesAgentId(order.getSalesAgent() != null ? order.getSalesAgent().getId() : null)
            .writerManagerId(order.getWriterManager() != null ? order.getWriterManager().getId() : null)
            .title(order.getTitle())
            .topic(order.getTopic())
            .description(order.getDescription())
            .type(order.getType())
            .educationLevel(order.getEducationLevel())
            .subject(order.getSubject())
            .pagesOrSlides(order.getPagesOrSlides())
            .words(order.getWords())
            .sourcesRequired(order.getSourcesRequired())
            .citationStyle(order.getCitationStyle())
            .language(order.getLanguage())
            .spacing(order.getSpacing())
            .totalAmount(order.getTotalAmount())
            .amountPaid(order.getAmountPaid())
            .currency(order.getCurrency())
            .totalBids(order.getTotalBids())
            .status(order.getStatus().name())
            .deadline(order.getDeadline())
            .deliveryTime(order.getDeliveryTime())
            .startedAt(order.getStartedAt())
            .submittedAt(order.getSubmittedAt())
            .completedAt(order.getCompletedAt())
            .isRevision(order.getIsRevision())
            .isOverdue(order.getIsOverdue())
            .customerIsReturning(order.getCustomerIsReturning())
            .createdAt(order.getCreatedAt())
            .updatedAt(order.getUpdatedAt())
            .build();
    }
}
