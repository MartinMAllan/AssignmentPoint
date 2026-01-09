package com.assignmentpoint.service;

import com.assignmentpoint.dto.MessageDTO;
import com.assignmentpoint.entity.Message;
import com.assignmentpoint.entity.Order;
import com.assignmentpoint.entity.User;
import com.assignmentpoint.exception.ResourceNotFoundException;
import com.assignmentpoint.repository.MessageRepository;
import com.assignmentpoint.repository.OrderRepository;
import com.assignmentpoint.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Transactional
    public MessageDTO sendMessage(Long orderId, Long senderId, Long receiverId, String messageText) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));

        User receiver = receiverId != null ? userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found")) : null;

        Message message = Message.builder()
                .order(order)
                .sender(sender)
                .receiver(receiver)
                .messageText(messageText)
                .isRead(false)
                .build();

        message = messageRepository.save(message);
        return convertToDTO(message);
    }

    public List<MessageDTO> getOrderMessages(Long orderId) {
        return messageRepository.findByOrderIdOrderByCreatedAtAsc(orderId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        message.setIsRead(true);
        message.setReadAt(LocalDateTime.now());
        messageRepository.save(message);
    }

    private MessageDTO convertToDTO(Message message) {
        return MessageDTO.builder()
                .id(message.getId())
                .orderId(message.getOrder().getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFirstName() + " " + message.getSender().getLastName())
                .receiverId(message.getReceiver() != null ? message.getReceiver().getId() : null)
                .receiverName(message.getReceiver() != null ? 
                        message.getReceiver().getFirstName() + " " + message.getReceiver().getLastName() : null)
                .messageText(message.getMessageText())
                .isRead(message.getIsRead())
                .readAt(message.getReadAt())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
