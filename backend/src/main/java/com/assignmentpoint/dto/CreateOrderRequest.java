package com.assignmentpoint.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Min;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CreateOrderRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Type is required")
    private String type;

    @NotBlank(message = "Education level is required")
    private String educationLevel;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotNull(message = "Pages/Slides is required")
    @Min(value = 1, message = "Pages/Slides must be at least 1")
    private Integer pages;

    @NotNull(message = "Word count is required")
    @Min(value = 1, message = "Word count must be at least 1")
    private Integer words;

    @NotNull(message = "Sources required is required")
    @Min(value = 0, message = "Sources required cannot be negative")
    private Integer sourcesRequired;

    @NotBlank(message = "Citation style is required")
    private String citationStyle;

    @NotBlank(message = "Language is required")
    private String language;

    @NotBlank(message = "Spacing is required")
    private String spacing;

    @NotNull(message = "Total amount is required")
    @Positive(message = "Total amount must be positive")
    private BigDecimal totalAmount;

    @NotNull(message = "Deadline is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm", shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING)
    private LocalDateTime deadline;

    @NotNull(message = "Delivery time is required")
    @Min(value = 1, message = "Delivery time must be at least 1 hour")
    private Integer deliveryTime;
}
