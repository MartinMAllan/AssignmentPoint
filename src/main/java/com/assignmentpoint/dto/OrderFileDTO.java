package com.assignmentpoint.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderFileDTO {
    private Long id;
    private Long orderId;
    private String fileName;
    private String fileUrl;
    private Long fileSize;
    private String fileType;
    private String fileCategory;
    private String uploadedBy;
    private Boolean isSeen;
    private LocalDateTime createdAt;
}
