package com.assignmentpoint.dto;

import com.assignmentpoint.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private String title;
    private String subject;
    private String educationLevel;
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private LocalDateTime deadline;
    private Integer deliveryTime;
    private Integer totalBids;
    private Long customerId;
    private Long writerId;
}
