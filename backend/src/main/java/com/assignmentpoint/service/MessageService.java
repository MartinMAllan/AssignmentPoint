package com.assignmentpoint.service;

import com.assignmentpoint.dto.CreateMessageRequest;
import com.assignmentpoint.dto.MessageDTO;
import com.assignmentpoint.entity.Message;
import com.assignmentpoint.entity.Order;
import com.assignmentpoint.entity.User;
import com.assignmentpoint.exception.ResourceNotFoundException;
import com.assignmentpoint.repository.MessageRepository;
import com.assignmentpoint.repository.OrderRepository;
import com.assignmentpoint.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public MessageDTO sendMessage(CreateMessageRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));

        User receiver = request.getReceiverId() != null ? userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found")) : null;

        Message message = Message.builder()
                .order(order)
                .sender(sender)
                .receiver(receiver)
                .messageText(request.getMessageText())
                .isRead(false)
                .build();

        message = messageRepository.save(message);
        return convertToDTO(message);
    }

    public Page<MessageDTO> getOrderMessages(Long orderId, Pageable pageable) {
        return messageRepository.findByOrderIdOrderByCreatedAtDesc(orderId, pageable)
                .map(this::convertToDTO);
    }

    public Page<MessageDTO> getUserMessages(Long userId, Pageable pageable) {
        return messageRepository.findBySenderIdOrReceiverId(userId, userId, pageable)
                .map(this::convertToDTO);
    }

    @Transactional
    public void markMessageAsRead(Long messageId) {
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
