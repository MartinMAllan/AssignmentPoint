package com.assignmentpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

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
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_manager_id")
    private User writerManager;
    
    private Double rating = 0.0;
    private Integer totalOrdersCompleted = 0;
    private Double successRate = 0.0;
    
    @ElementCollection
    @CollectionTable(name = "writer_specializations", joinColumns = @JoinColumn(name = "writer_id"))
    @Column(name = "specialization")
    private Set<String> specializations = new HashSet<>();
    
    @Enumerated(EnumType.STRING)
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;
    
    private BigDecimal walletBalance = BigDecimal.ZERO;
    private Integer totalBidsSubmitted = 0;
    private Integer totalBidsWon = 0;
    
    public enum AvailabilityStatus {
        AVAILABLE, BUSY, UNAVAILABLE
    }
}
