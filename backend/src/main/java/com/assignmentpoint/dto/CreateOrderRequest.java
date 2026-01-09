package com.assignmentpoint.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CreateOrderRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotBlank(message = "Type is required")
    private String type;
    
    @NotBlank(message = "Education level is required")
    private String educationLevel;
    
    @NotBlank(message = "Subject is required")
    private String subject;
    
    private Integer pages;
    private Integer words;
    private Integer sourcesRequired;
    private String citationStyle;
    private String language;
    private String spacing;
    
    @NotNull(message = "Total amount is required")
    @Positive(message = "Total amount must be positive")
    private BigDecimal totalAmount;
    
    @NotNull(message = "Deadline is required")
    private LocalDateTime deadline;
    
    private Integer deliveryTime;
}
