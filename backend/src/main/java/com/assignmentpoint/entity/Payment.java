package com.assignmentpoint.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod; // STRIPE or PAYPAL

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentType paymentType; // CARD, BANK_TRANSFER, PAYPAL_WALLET

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status; // PENDING, COMPLETED, FAILED, CANCELLED, REFUNDED

    @Column(name = "stripe_payment_intent_id")
    private String stripePaymentIntentId;

    @Column(name = "stripe_charge_id")
    private String stripeChargeId;

    @Column(name = "paypal_transaction_id")
    private String paypalTransactionId;

    @Column(name = "paypal_order_id")
    private String paypalOrderId;

    @Column(length = 255)
    private String description;

    @Column(name = "error_message", length = 500)
    private String errorMessage;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum PaymentMethod {
        STRIPE, PAYPAL
    }

    public enum PaymentType {
        CARD, BANK_TRANSFER, PAYPAL_WALLET
    }

    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, CANCELLED, REFUNDED
    }
}
