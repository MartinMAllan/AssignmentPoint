package com.assignmentpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_agent_id")
    private SalesAgent salesAgent;

    private String referralCodeUsed;

    @Column(columnDefinition = "boolean default false")
    private Boolean isReturning = false;

    private Integer totalOrders = 0;
    private BigDecimal totalSpent = BigDecimal.ZERO;

    // Wallet fields for payment deposits
    @Column(precision = 10, scale = 2)
    private BigDecimal walletBalance = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalDeposited = BigDecimal.ZERO;

    private LocalDateTime lastDepositDate;
}
