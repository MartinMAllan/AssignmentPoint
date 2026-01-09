package com.assignmentpoint.service;

import com.assignmentpoint.dto.OrderFileDTO;
import com.assignmentpoint.entity.Order;
import com.assignmentpoint.entity.OrderFile;
import com.assignmentpoint.entity.User;
import com.assignmentpoint.exception.ResourceNotFoundException;
import com.assignmentpoint.repository.OrderFileRepository;
import com.assignmentpoint.repository.OrderRepository;
import com.assignmentpoint.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderFileService {
    
    @Autowired
    private OrderFileRepository orderFileRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Transactional
    public OrderFileDTO uploadFile(Long orderId, Long userId, MultipartFile file, String category) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        String filename = fileStorageService.storeFile(file);
        
        OrderFile orderFile = OrderFile.builder()
            .order(order)
            .uploadedBy(user)
            .fileName(file.getOriginalFilename())
            .fileUrl("/files/" + filename)
            .fileSize(file.getSize())
            .fileType(file.getContentType())
            .fileCategory(category)
            .uploadedAt(LocalDateTime.now())
            .build();
        
        orderFile = orderFileRepository.save(orderFile);
        return convertToDTO(orderFile);
    }
    
    public List<OrderFileDTO> getOrderFiles(Long orderId) {
        return orderFileRepository.findByOrderId(orderId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void markFileAsSeen(Long fileId, Long userId) {
        OrderFile file = orderFileRepository.findById(fileId)
            .orElseThrow(() -> new ResourceNotFoundException("File not found"));
        
        file.setIsSeen(true);
        file.setSeenAt(LocalDateTime.now());
        orderFileRepository.save(file);
    }
    
    private OrderFileDTO convertToDTO(OrderFile file) {
        return OrderFileDTO.builder()
            .id(file.getId())
            .orderId(file.getOrder().getId())
            .uploadedBy(file.getUploadedBy().getId())
            .uploaderName(file.getUploadedBy().getFirstName() + " " + file.getUploadedBy().getLastName())
            .fileName(file.getFileName())
            .fileUrl(file.getFileUrl())
            .fileSize(file.getFileSize())
            .fileType(file.getFileType())
            .fileCategory(file.getFileCategory())
            .isSeen(file.getIsSeen())
            .seenAt(file.getSeenAt())
            .uploadedAt(file.getUploadedAt())
            .build();
    }
}
