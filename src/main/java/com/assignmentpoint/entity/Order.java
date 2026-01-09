package com.assignmentpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String orderNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_id")
    private Writer writer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "editor_id")
    private User editor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_agent_id")
    private SalesAgent salesAgent;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_manager_id")
    private User writerManager;
    
    // Order details
    @Column(nullable = false, length = 500)
    private String title;
    
    private String topic;
    private String description;
    private String type;
    private String educationLevel;
    private String subject;
    
    // Specifications
    private Integer pagesOrSlides;
    private Integer words;
    private Integer sourcesRequired;
    private String citationStyle;
    private String language = "English (US)";
    private String spacing;
    
    // Pricing
    @Column(nullable = false)
    private BigDecimal totalAmount;
    
    private BigDecimal amountPaid = BigDecimal.ZERO;
    private String currency = "USD";
    
    // Bidding
    private Integer totalBids = 0;
    private Long winningBidId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.AVAILABLE;
    
    @Column(nullable = false)
    private LocalDateTime deadline;
    
    private Integer deliveryTime;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private LocalDateTime completedAt;
    
    @Column(columnDefinition = "boolean default false")
    private Boolean isRevision = false;
    
    @Column(columnDefinition = "boolean default false")
    private Boolean isOverdue = false;
    
    @Column(columnDefinition = "boolean default false")
    private Boolean customerIsReturning = false;
    
    public enum OrderStatus {
        AVAILABLE, PENDING, IN_PROGRESS, IN_REVIEW, REVISION, COMPLETED, CANCELED, DISPUTED
    }
}
