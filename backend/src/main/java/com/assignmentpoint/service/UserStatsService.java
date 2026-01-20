package com.assignmentpoint.service;

import com.assignmentpoint.dto.UserStatsDTO;
import com.assignmentpoint.entity.*;
import com.assignmentpoint.exception.ResourceNotFoundException;
import com.assignmentpoint.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class UserStatsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private WriterRepository writerRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SalesAgentRepository salesAgentRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public UserStatsDTO getUserStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserStatsDTO.UserStatsDTOBuilder statsBuilder = UserStatsDTO.builder();

        switch (user.getRole()) {
            case WRITER:
                return getWriterStats(userId, statsBuilder);
            case CUSTOMER:
                return getCustomerStats(userId, statsBuilder);
            case SALES_AGENT:
                return getSalesAgentStats(userId, statsBuilder);
            case ADMIN:
                return getAdminStats(statsBuilder);
            case EDITOR:
                return getEditorStats(userId, statsBuilder);
//            case WRITER_MANAGER:
//                return getManagerStats(userId, statsBuilder);
            default:
                return statsBuilder.build();
        }
    }

    private UserStatsDTO getWriterStats(Long userId, UserStatsDTO.UserStatsDTOBuilder builder) {
        List<Order> writerOrders = orderRepository.findByWriterId(userId);

        int available = (int) writerOrders.stream().filter(o -> o.getStatus() == Order.OrderStatus.AVAILABLE).count();
        int inProgress = (int) writerOrders.stream().filter(o -> o.getStatus() == Order.OrderStatus.IN_PROGRESS).count();
        int inReview = (int) writerOrders.stream().filter(o -> o.getStatus() == Order.OrderStatus.IN_REVIEW).count();
        int revision = (int) writerOrders.stream().filter(o -> o.getStatus() == Order.OrderStatus.REVISION).count();
        int disputed = (int) writerOrders.stream().filter(o -> o.getStatus() == Order.OrderStatus.DISPUTED).count();
        int completedPaid = (int) writerOrders.stream().filter(o -> o.getStatus() == Order.OrderStatus.COMPLETED).count();

        BigDecimal totalEarnings = transactionRepository.sumAmountByUserIdAndType(userId, Transaction.TransactionType.WRITER_EARNING);
        if (totalEarnings == null) {
            totalEarnings = BigDecimal.ZERO;
        }

        return builder
                .available(available)
                .inProgress(inProgress)
                .inReview(inReview)
                .revision(revision)
                .disputed(disputed)
                .completedPaid(completedPaid)
                .totalEarnings(totalEarnings)
                .totalOrders(writerOrders.size())
                .build();
    }

    private UserStatsDTO getCustomerStats(Long userId, UserStatsDTO.UserStatsDTOBuilder builder) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        List<Order> customerOrders = orderRepository.findByCustomerId(customer.getId());

        int inProgress = (int) customerOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.IN_PROGRESS).count();
        int inReview = (int) customerOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.IN_REVIEW).count();
        int revision = (int) customerOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.REVISION).count();
        int completedPaid = (int) customerOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.COMPLETED).count();

        BigDecimal totalSpent = customer.getTotalSpent() != null ? customer.getTotalSpent() : BigDecimal.ZERO;

        return builder
                .inProgress(inProgress)
                .inReview(inReview)
                .revision(revision)
                .completedPaid(completedPaid)
                .totalOrders(customer.getTotalOrders())
                .totalEarnings(totalSpent)
                .build();
    }

    private UserStatsDTO getSalesAgentStats(Long userId, UserStatsDTO.UserStatsDTOBuilder builder) {
        SalesAgent agent = salesAgentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Sales agent not found"));

        BigDecimal commission = transactionRepository.sumAmountByUserIdAndType(userId, Transaction.TransactionType.SALES_COMMISSION);
        if (commission == null) {
            commission = BigDecimal.ZERO;
        }

        return builder
                .activeCustomers(agent.getActiveCustomers())
                .totalReferrals(agent.getTotalReferrals())
                .totalCommission(commission)
                .build();
    }

    private UserStatsDTO getAdminStats(UserStatsDTO.UserStatsDTOBuilder builder) {
        List<Order> allOrders = orderRepository.findAll();
        int available = (int) allOrders.stream().filter(o -> o.getStatus() == Order.OrderStatus.AVAILABLE).count();
        int inProgress = (int) allOrders.stream().filter(o -> o.getStatus() == Order.OrderStatus.IN_PROGRESS).count();
        int completedPaid = (int) allOrders.stream().filter(o -> o.getStatus() == Order.OrderStatus.COMPLETED).count();

        BigDecimal totalRevenue = BigDecimal.ZERO;
        for (Order order : allOrders) {
            totalRevenue = totalRevenue.add(order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO);
        }

        return builder
                .available(available)
                .inProgress(inProgress)
                .completedPaid(completedPaid)
                .totalOrders(allOrders.size())
                .totalRevenue(totalRevenue)
                .build();
    }

    private UserStatsDTO getEditorStats(Long userId, UserStatsDTO.UserStatsDTOBuilder builder) {
        List<Order> editorOrders = orderRepository.findByEditorId(userId);

        int inReview = (int) editorOrders.stream().filter(o -> o.getStatus() == Order.OrderStatus.IN_REVIEW).count();
        int completedPaid = (int) editorOrders.stream().filter(o -> o.getStatus() == Order.OrderStatus.COMPLETED).count();

        BigDecimal totalEarnings = transactionRepository.sumAmountByUserIdAndType(userId, Transaction.TransactionType.EDITOR_EARNING);
        if (totalEarnings == null) {
            totalEarnings = BigDecimal.ZERO;
        }

        return builder
                .inReview(inReview)
                .completedPaid(completedPaid)
                .totalOrders(editorOrders.size())
                .totalEarnings(totalEarnings)
                .build();
    }

    private UserStatsDTO getManagerStats(Long userId, UserStatsDTO.UserStatsDTOBuilder builder) {
        List<Writer> managedWriters = writerRepository.findByWriterManagerId(userId);
        int writersManaged = managedWriters.size();

        int totalOrders = 0;
        BigDecimal totalEarnings = BigDecimal.ZERO;

        for (Writer writer : managedWriters) {
            List<Order> writerOrders = orderRepository.findByWriterId(writer.getId());
            totalOrders += writerOrders.size();

            BigDecimal writerEarnings = transactionRepository.sumAmountByUserIdAndType(writer.getUser().getId(), Transaction.TransactionType.WRITER_EARNING);
            if (writerEarnings != null) {
                totalEarnings = totalEarnings.add(writerEarnings);
            }
        }

        return builder
                .writersManaged(writersManaged)
                .totalOrders(totalOrders)
                .totalEarnings(totalEarnings)
                .build();
    }
}
