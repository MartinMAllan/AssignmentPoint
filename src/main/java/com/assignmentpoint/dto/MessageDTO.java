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
public class MessageDTO {
    private Long id;
    private Long orderId;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private String messageText;
    private Boolean isRead;
    private LocalDateTime readAt;
    private LocalDateTime createdAt;
}
