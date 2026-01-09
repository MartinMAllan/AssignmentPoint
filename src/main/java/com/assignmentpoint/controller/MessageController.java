package com.assignmentpoint.controller;

import com.assignmentpoint.dto.MessageDTO;
import com.assignmentpoint.service.MessageService;
import com.assignmentpoint.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<ApiResponse<MessageDTO>> sendMessage(@RequestBody Map<String, Object> request) {
        Long orderId = Long.valueOf(request.get("orderId").toString());
        Long senderId = Long.valueOf(request.get("senderId").toString());
        Long receiverId = request.get("receiverId") != null ? 
                Long.valueOf(request.get("receiverId").toString()) : null;
        String messageText = request.get("messageText").toString();

        MessageDTO message = messageService.sendMessage(orderId, senderId, receiverId, messageText);
        return ResponseEntity.ok(new ApiResponse<>(true, "Message sent", message));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<MessageDTO>>> getOrderMessages(@PathVariable Long orderId) {
        List<MessageDTO> messages = messageService.getOrderMessages(orderId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Messages retrieved", messages));
    }

    @PatchMapping("/{messageId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long messageId) {
        messageService.markAsRead(messageId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Message marked as read", null));
    }
}
