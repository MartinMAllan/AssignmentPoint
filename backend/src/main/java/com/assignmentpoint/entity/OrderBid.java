package com.assignmentpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "order_bids")
@Data
@NoArgsConstructor
@AllArgsConstructor
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

    @Column(name = "amount", nullable = false) // matches DB column
    private BigDecimal amount;

//    @Column(name = "currency", nullable = false)
//    private String currency = "USD";

    @Column(name = "delivery_hours", nullable = false)
    private Integer deliveryHours;

    @Column(name = "proposal", columnDefinition = "TEXT")
    private String coverLetter;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BidStatus status = BidStatus.PENDING;

    public enum BidStatus {
        PENDING, ACCEPTED, REJECTED, WITHDRAWN
    }
}
