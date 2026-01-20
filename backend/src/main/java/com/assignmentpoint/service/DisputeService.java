package com.assignmentpoint.service;

import com.assignmentpoint.dto.OrderDTO;
import com.assignmentpoint.entity.Order;
import com.assignmentpoint.exception.ResourceNotFoundException;
import com.assignmentpoint.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DisputeService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    public Map<String, Integer> getDisputeCounts() {
        Map<String, Integer> counts = new HashMap<>();

        List<Order> allDisputes = orderRepository.findByStatus(Order.OrderStatus.DISPUTED);

        counts.put("open", (int) allDisputes.stream()
                .filter(o -> o.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(7)))
                .count());
        counts.put("investigating", (int) allDisputes.stream()
                .filter(o -> o.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(30)))
                .count());
        counts.put("resolved", 0); // Disputes that have been resolved (can use a field if added)

        return counts;
    }

    public List<OrderDTO> getActiveDisputes() {
        List<Order> disputes = orderRepository.findByStatus(Order.OrderStatus.DISPUTED);
        return disputes.stream()
                .map(orderService::convertToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO resolveDispute(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(Order.OrderStatus.COMPLETED);
        Order updatedOrder = orderRepository.save(order);

        return orderService.convertToDTO(updatedOrder);
    }

    public Map<String, List<OrderDTO>> getDisputesByStatus() {
        Map<String, List<OrderDTO>> disputesByStatus = new HashMap<>();

        List<Order> allDisputes = orderRepository.findByStatus(Order.OrderStatus.DISPUTED);

        List<OrderDTO> openDisputes = allDisputes.stream()
                .filter(o -> o.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(7)))
                .map(orderService::convertToDTO)
                .collect(Collectors.toList());

        List<OrderDTO> investigatingDisputes = allDisputes.stream()
                .filter(o -> o.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(30))
                        && o.getCreatedAt().isBefore(java.time.LocalDateTime.now().minusDays(7)))
                .map(orderService::convertToDTO)
                .collect(Collectors.toList());

        disputesByStatus.put("open", openDisputes);
        disputesByStatus.put("investigating", investigatingDisputes);
        disputesByStatus.put("resolved", new ArrayList<>());

        return disputesByStatus;
    }
}
