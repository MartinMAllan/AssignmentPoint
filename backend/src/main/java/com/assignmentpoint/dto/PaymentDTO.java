package com.assignmentpoint.dto;

import com.assignmentpoint.entity.Payment;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    private Long id;
    private Long customerId;
    private Payment.PaymentMethod paymentMethod;
    private Payment.PaymentType paymentType;
    private BigDecimal amount;
    private Payment.PaymentStatus status;
    private String stripePaymentIntentId;
    private String paypalOrderId;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
