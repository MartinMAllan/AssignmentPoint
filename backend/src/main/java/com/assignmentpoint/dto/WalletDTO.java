package com.assignmentpoint.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletDTO {
    private Long customerId;
    private BigDecimal balance;
    private BigDecimal totalDeposited;
}
