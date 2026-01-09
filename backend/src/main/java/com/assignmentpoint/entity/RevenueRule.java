package com.assignmentpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "revenue_rules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueRule extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String ruleName;
    
    @Column(nullable = false)
    private Boolean isReturningCustomer;
    
    @Column(nullable = false)
    private BigDecimal writerPercentage;
    
    private BigDecimal salesAgentPercentage = BigDecimal.ZERO;
    private BigDecimal editorPercentage = BigDecimal.ZERO;
    private BigDecimal managerPercentage = BigDecimal.ZERO;
    
    @Column(nullable = false)
    private BigDecimal profitPercentage;
    
    @Column(columnDefinition = "boolean default true")
    private Boolean isActive = true;
}
