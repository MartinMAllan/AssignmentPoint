package com.assignmentpoint.controller;

import com.assignmentpoint.dto.OrderFileDTO;
import com.assignmentpoint.service.FileStorageService;
import com.assignmentpoint.service.OrderFileService;
import com.assignmentpoint.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class FileController {
    
    private final FileStorageService fileStorageService;
    private final OrderFileService orderFileService;
    
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<String>> uploadFile(@RequestParam MultipartFile file) {
        String fileUrl = fileStorageService.uploadFile(file);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse<>(true, "File uploaded successfully", fileUrl));
    }
    
    @PostMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<OrderFileDTO>> attachFileToOrder(
        @PathVariable Long orderId,
        @RequestParam MultipartFile file,
        @RequestParam String fileCategory,
        @RequestAttribute("userId") Long userId) {
        OrderFileDTO fileDto = orderFileService.attachFileToOrder(orderId, file, fileCategory, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse<>(true, "File attached successfully", fileDto));
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<OrderFileDTO>>> getOrderFiles(@PathVariable Long orderId) {
        List<OrderFileDTO> files = orderFileService.getOrderFiles(orderId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Files retrieved", files));
    }
    
    @DeleteMapping("/{fileId}")
    public ResponseEntity<ApiResponse<Boolean>> deleteFile(@PathVariable Long fileId) {
        boolean deleted = orderFileService.deleteFile(fileId);
        return ResponseEntity.ok(new ApiResponse<>(true, "File deleted", deleted));
    }
}
