package com.assignmentpoint.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateBidRequest {
    @NotNull(message = "Order ID is required")
    private Long orderId;
    
    private String coverLetter;
}
