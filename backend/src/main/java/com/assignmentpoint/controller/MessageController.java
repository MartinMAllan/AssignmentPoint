package com.assignmentpoint.controller;

import com.assignmentpoint.dto.CreateMessageRequest;
import com.assignmentpoint.dto.MessageDTO;
import com.assignmentpoint.service.MessageService;
import com.assignmentpoint.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<ApiResponse<MessageDTO>> sendMessage(@Valid @RequestBody CreateMessageRequest request) {
        MessageDTO message = messageService.sendMessage(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Message sent successfully", message));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<Page<MessageDTO>>> getOrderMessages(
            @PathVariable Long orderId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MessageDTO> messages = messageService.getOrderMessages(orderId, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Messages retrieved successfully", messages));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Page<MessageDTO>>> getUserMessages(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MessageDTO> messages = messageService.getUserMessages(userId, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "User messages retrieved successfully", messages));
    }

    @PutMapping("/{messageId}/mark-read")
    public ResponseEntity<ApiResponse<Void>> markMessageAsRead(@PathVariable Long messageId) {
        messageService.markMessageAsRead(messageId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Message marked as read", null));
    }
}
