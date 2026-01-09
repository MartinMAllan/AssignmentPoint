package com.assignmentpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "revenue_rules", uniqueConstraints = @UniqueConstraint(columnNames = {"customer_type", "role"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueRule extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CustomerType customerType;
    
    @Column(nullable = false)
    private String role;
    
    @Column(nullable = false)
    private BigDecimal percentage;
    
    @Column(columnDefinition = "boolean default true")
    private Boolean isActive = true;
    
    public enum CustomerType {
        NEW, RETURNING
    }
}
