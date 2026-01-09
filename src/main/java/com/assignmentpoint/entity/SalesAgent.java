package com.assignmentpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "sales_agents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesAgent extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @Column(unique = true, nullable = false)
    private String referralCode;
    
    private Integer totalReferrals = 0;
    private Integer activeCustomers = 0;
    private BigDecimal walletBalance = BigDecimal.ZERO;
}
