package com.assignmentpoint.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateDepositRequest {
    private BigDecimal amount;
    private String paymentMethod; // "stripe" or "paypal"
    private String description;
    private String returnUrl; // For PayPal redirect
}
