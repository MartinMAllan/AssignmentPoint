package com.assignmentpoint.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private Long customerId;
    private String customerName;
    private Long writerId;
    private String writerName;
    private Long editorId;
    private Long salesAgentId;
    private Long writerManagerId;
    
    private String title;
    private String topic;
    private String description;
    private String type;
    private String educationLevel;
    private String subject;
    
    private Integer pagesOrSlides;
    private Integer words;
    private Integer sourcesRequired;
    private String citationStyle;
    private String language;
    private String spacing;
    
    private BigDecimal totalAmount;
    private BigDecimal amountPaid;
    private String currency;
    
    private Integer totalBids;
    private String status;
    
    private LocalDateTime deadline;
    private Integer deliveryTime;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private LocalDateTime completedAt;
    
    private Boolean isRevision;
    private Boolean isOverdue;
    private Boolean customerIsReturning;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
