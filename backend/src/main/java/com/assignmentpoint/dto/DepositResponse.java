package com.assignmentpoint.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepositResponse {
    private Long paymentId;
    private String status;
    private BigDecimal amount;
    private String clientSecret; // For Stripe
    private String redirectUrl; // For PayPal
    private String message;
}
