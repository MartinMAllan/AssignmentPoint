package com.assignmentpoint.dto;

import com.assignmentpoint.entity.OrderBid;
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
public class BidDTO {
    private Long id;
    private Long orderId;
    private Long writerId;
    private String writerName;
    private BigDecimal bidAmount;
    private BigDecimal proposedWriterShare;
    private String coverLetter;
    private OrderBid.BidStatus status;
    private LocalDateTime submittedAt;
}
