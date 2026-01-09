package com.assignmentpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_bids", uniqueConstraints = @UniqueConstraint(columnNames = {"order_id", "writer_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderBid extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_id", nullable = false)
    private Writer writer;
    
    private BigDecimal bidAmount;
    private BigDecimal proposedWriterShare;
    private String coverLetter;
    private Integer deliveryTime;
    
    @Enumerated(EnumType.STRING)
    private BidStatus status = BidStatus.PENDING;
    
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;
    
    private String rejectionReason;
    
    public enum BidStatus {
        PENDING, ACCEPTED, REJECTED, WITHDRAWN
    }
}
