package com.assignmentpoint.entity;

import jakarta.persistence.*;
import lombok.*;
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

    @Column(name = "order_number", nullable = false, unique = true, length = 50)
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

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "topic", length = 255)
    private String topic;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "type", length = 50)
    private String type;

    @Column(name = "paper_type", length = 50)
    private String paperType;

    @Column(name = "academic_level", length = 50)
    private String educationLevel;

    @Column(name = "subject", length = 100)
    private String subject;

    @Column(name = "pages", nullable = false)
    private Integer pagesOrSlides;

    @Column(name = "words")
    private Integer words;

    @Column(name = "sources_required")
    private Integer sourcesRequired;

    @Column(name = "citation_style", length = 255)
    private String citationStyle;

    @Column(name = "language", length = 255)
    private String language;

    @Column(name = "spacing", length = 255)
    private String spacing;

    @Column(nullable = false, name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "amount_paid", precision = 38, scale = 2)
    private BigDecimal amountPaid;

    @Column(name = "currency", length = 255)
    private String currency;

    @Column(name = "total_bids")
    private Integer totalBids;

    @Column(name = "winning_bid_id")
    private Long winningBidId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status",nullable = false)
    private OrderStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private Priority priority;

    @Column(name = "deadline",nullable = false)
    private LocalDateTime deadline;

    @Column(name = "delivery_time")
    private Integer deliveryTime;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "is_revision")
    private Boolean isRevision;

    @Column(name = "is_overdue")
    private Boolean isOverdue;

    @Column(name = "customer_is_returning")
    private Boolean customerIsReturning;

    @Column(name = "deposit_required")
    private Boolean depositRequired;

    @Column(name = "deposit_released")
    private Boolean depositReleased;

    @Column(name = "deposit_amount", precision = 10, scale = 2)
    private BigDecimal depositAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;

    public enum OrderStatus {
        AVAILABLE,
        PENDING,
        IN_PROGRESS,
        IN_REVIEW,
        REVISION,
        COMPLETED,
        CANCELED,
        DISPUTED
    }

    public enum Priority {
        LOW,
        MEDIUM,
        HIGH,
        URGENT
    }

    public enum PaymentStatus {
        NOT_PAID,
        PENDING,
        PAID,
        REFUNDED
    }
}
