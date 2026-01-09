package com.assignmentpoint.service;

import com.assignmentpoint.dto.OrderFileDTO;
import com.assignmentpoint.entity.Order;
import com.assignmentpoint.entity.OrderFile;
import com.assignmentpoint.entity.User;
import com.assignmentpoint.exception.ResourceNotFoundException;
import com.assignmentpoint.repository.OrderFileRepository;
import com.assignmentpoint.repository.OrderRepository;
import com.assignmentpoint.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderFileService {
    
    private final OrderFileRepository orderFileRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    
    public OrderFileDTO attachFileToOrder(Long orderId, MultipartFile file, String fileCategory, Long userId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        String fileUrl = fileStorageService.uploadFile(file);
        
        OrderFile orderFile = OrderFile.builder()
            .order(order)
            .uploadedBy(user)
            .fileName(file.getOriginalFilename())
            .fileUrl(fileUrl)
            .fileSize(file.getSize())
            .fileType(getFileExtension(file.getOriginalFilename()))
            .fileCategory(OrderFile.FileCategory.valueOf(fileCategory))
            .isSeen(false)
            .build();
        
        orderFile = orderFileRepository.save(orderFile);
        return convertToDTO(orderFile);
    }
    
    public List<OrderFileDTO> getOrderFiles(Long orderId) {
        return orderFileRepository.findByOrderId(orderId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<OrderFileDTO> getOrderFilesByCategory(Long orderId, String category) {
        return orderFileRepository.findByOrderIdAndFileCategory(orderId, OrderFile.FileCategory.valueOf(category))
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public boolean deleteFile(Long fileId) {
        OrderFile file = orderFileRepository.findById(fileId)
            .orElseThrow(() -> new ResourceNotFoundException("File not found"));
        
        fileStorageService.deleteFile(file.getFileUrl());
        orderFileRepository.deleteById(fileId);
        return true;
    }
    
    private String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }
    
    private OrderFileDTO convertToDTO(OrderFile file) {
        return OrderFileDTO.builder()
            .id(file.getId())
            .orderId(file.getOrder().getId())
            .fileName(file.getFileName())
            .fileUrl(file.getFileUrl())
            .fileSize(file.getFileSize())
            .fileType(file.getFileType())
            .fileCategory(file.getFileCategory().toString())
            .uploadedBy(file.getUploadedBy().getFirstName() + " " + file.getUploadedBy().getLastName())
            .isSeen(file.getIsSeen())
            .createdAt(file.getCreatedAt())
            .build();
    }
}
