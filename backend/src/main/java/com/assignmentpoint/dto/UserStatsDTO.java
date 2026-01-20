package com.assignmentpoint.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDTO {
    private Integer available;
    private Integer inProgress;
    private Integer inReview;
    private Integer revision;
    private Integer disputed;
    private Integer completedPaid;
    private BigDecimal totalEarnings;
    private Integer totalOrders;
    private Integer activeCustomers;
    private Integer newCustomers;
    private Integer returningCustomers;
    private Integer writersManaged;
    private Integer totalReferrals;
    private BigDecimal totalRevenue;
    private BigDecimal totalCommission;
    private BigDecimal pendingCommission;
}
