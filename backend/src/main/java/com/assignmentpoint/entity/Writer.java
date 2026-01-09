package com.assignmentpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "writers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Writer extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_manager_id")
    private User writerManager;
    
    private BigDecimal rating = BigDecimal.ZERO;
    private Integer totalOrdersCompleted = 0;
    private BigDecimal successRate = BigDecimal.ZERO;
    
    @Column(columnDefinition = "TEXT")
    private String specializations;
    
    private String availabilityStatus = "available";
    private BigDecimal walletBalance = BigDecimal.ZERO;
}
