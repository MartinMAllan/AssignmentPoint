package com.assignmentpoint.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderFileDTO {
    private Long id;
    private Long orderId;
    private Long uploadedBy;
    private String uploaderName;
    private String fileName;
    private String fileUrl;
    private Long fileSize;
    private String fileType;
    private String fileCategory;
    private Boolean isSeen;
    private LocalDateTime seenAt;
    private LocalDateTime uploadedAt;
}
