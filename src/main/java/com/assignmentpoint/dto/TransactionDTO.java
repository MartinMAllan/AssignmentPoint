package com.assignmentpoint.dto;

import com.assignmentpoint.entity.Transaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {
    private Long id;
    private Long userId;
    private Transaction.TransactionType transactionType;
    private BigDecimal amount;
    private String currency;
    private String description;
    private Transaction.TransactionStatus status;
    private LocalDateTime createdAt;
}
