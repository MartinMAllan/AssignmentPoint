package com.assignmentpoint.service;

import com.assignmentpoint.dto.TransactionDTO;
import com.assignmentpoint.entity.Order;
import com.assignmentpoint.entity.Transaction;
import com.assignmentpoint.repository.OrderRepository;
import com.assignmentpoint.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service
public class RevenueService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private OrderRepository orderRepository;

    public Map<String, Object> getRevenueMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        // Total Revenue from completed orders
        List<Order> completedOrders = orderRepository.findByStatus(Order.OrderStatus.COMPLETED);
        BigDecimal totalRevenue = completedOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate splits based on revenue rules
        BigDecimal writerEarnings = totalRevenue.multiply(BigDecimal.valueOf(0.4)); // 40% to writers
        BigDecimal platformProfit = totalRevenue.multiply(BigDecimal.valueOf(0.3)); // 30% platform profit
        BigDecimal agentCommissions = totalRevenue.multiply(BigDecimal.valueOf(0.15)); // 15% to agents
        BigDecimal managerEarnings = totalRevenue.multiply(BigDecimal.valueOf(0.15)); // 15% to managers

        metrics.put("totalRevenue", totalRevenue);
        metrics.put("writerEarnings", writerEarnings);
        metrics.put("platformProfit", platformProfit);
        metrics.put("agentCommissions", agentCommissions);
        metrics.put("managerEarnings", managerEarnings);

        return metrics;
    }

    public List<TransactionDTO> getRecentTransactions(int limit) {
        List<Transaction> transactions = transactionRepository.findAll();
        List<TransactionDTO> result = new ArrayList<>();

        transactions.stream()
                .filter(t -> t.getStatus() == Transaction.TransactionStatus.COMPLETED)
                .sorted(Comparator.comparing(Transaction::getCreatedAt).reversed())
                .limit(limit)
                .forEach(t -> result.add(convertToDTO(t)));

        return result;
    }

    public Map<String, Object> getRevenueBreakdown() {
        Map<String, Object> breakdown = new HashMap<>();

        List<Order> completedOrders = orderRepository.findByStatus(Order.OrderStatus.COMPLETED);
        BigDecimal totalRevenue = completedOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        breakdown.put("totalRevenue", totalRevenue);
        breakdown.put("writerShare", totalRevenue.multiply(BigDecimal.valueOf(0.4)));
        breakdown.put("platformShare", totalRevenue.multiply(BigDecimal.valueOf(0.3)));
        breakdown.put("agentShare", totalRevenue.multiply(BigDecimal.valueOf(0.15)));
        breakdown.put("managerShare", totalRevenue.multiply(BigDecimal.valueOf(0.15)));
        breakdown.put("totalOrders", (long) completedOrders.size());

        return breakdown;
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .orderId(transaction.getOrder() != null ? transaction.getOrder().getId() : null)
                .orderNumber(transaction.getOrder() != null ? transaction.getOrder().getOrderNumber() : null)
                .userId(transaction.getUser().getId())
                .userName(transaction.getUser().getFirstName() + " " + transaction.getUser().getLastName())
                .transactionType(transaction.getTransactionType().name())
                .amount(transaction.getAmount())
                .currency(transaction.getCurrency())
                .description(transaction.getDescription())
                .status(transaction.getStatus().name())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
