package com.assignmentpoint.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    @NotBlank
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
    
    @NotNull
    private BigDecimal totalAmount;
    
    private String currency;
    
    @NotNull
    private LocalDateTime deadline;
    
    @NotNull
    private Integer deliveryTime;
}
