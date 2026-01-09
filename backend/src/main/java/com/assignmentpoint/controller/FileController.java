package com.assignmentpoint.controller;

import com.assignmentpoint.dto.OrderFileDTO;
import com.assignmentpoint.service.FileStorageService;
import com.assignmentpoint.service.OrderFileService;
import com.assignmentpoint.util.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {
    
    @Autowired
    private OrderFileService orderFileService;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<OrderFileDTO>> uploadFile(
            @RequestParam Long orderId,
            @RequestParam Long userId,
            @RequestParam String category,
            @RequestParam("file") MultipartFile file) {
        OrderFileDTO orderFile = orderFileService.uploadFile(orderId, userId, file, category);
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", orderFile));
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<OrderFileDTO>>> getOrderFiles(@PathVariable Long orderId) {
        List<OrderFileDTO> files = orderFileService.getOrderFiles(orderId);
        return ResponseEntity.ok(ApiResponse.success("Order files retrieved", files));
    }
    
    @GetMapping("/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path filePath = fileStorageService.loadFile(filename);
            Resource resource = new UrlResource(filePath.toUri());
            
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{fileId}/mark-seen")
    public ResponseEntity<ApiResponse<Void>> markFileAsSeen(
            @PathVariable Long fileId,
            @RequestParam Long userId) {
        orderFileService.markFileAsSeen(fileId, userId);
        return ResponseEntity.ok(ApiResponse.success("File marked as seen", null));
    }
}
