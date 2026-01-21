package com.assignmentpoint.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidDTO {
    private Long id;
    private Long orderId;
    private String orderNumber;
    private String orderTitle;
    private BigDecimal orderAmount;
    private LocalDateTime orderDeadline;
    private Long writerId;
    private String writerName;
    private String writerEmail;
    private BigDecimal writerRating;
    private Integer writerCompletedOrders;
    private BigDecimal bidAmount;
    private String currency;
    private Integer deliveryHours;
    private String coverLetter;
    private String status;
    private LocalDateTime submittedAt;
}
