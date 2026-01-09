package com.assignmentpoint.service;

import com.assignmentpoint.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FileStorageService {
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    @Value("${file.max-size:52428800}")
    private long maxFileSize;
    
    @Value("${file.allowed-extensions:pdf,doc,docx,txt,jpg,jpeg,png,xlsx,pptx}")
    private String allowedExtensions;
    
    public String uploadFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }
        
        if (file.getSize() > maxFileSize) {
            throw new BadRequestException("File size exceeds maximum limit of " + (maxFileSize / (1024 * 1024)) + "MB");
        }
        
        String fileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(fileName);
        
        if (!isAllowedExtension(fileExtension)) {
            throw new BadRequestException("File type not allowed: " + fileExtension);
        }
        
        String uniqueFileName = generateUniqueFileName(fileName);
        
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.write(filePath, file.getBytes());
            
            return "/uploads/" + uniqueFileName;
        } catch (IOException e) {
            throw new BadRequestException("Failed to upload file: " + e.getMessage());
        }
    }
    
    public boolean deleteFile(String fileUrl) {
        try {
            String fileName = fileUrl.replace("/uploads/", "");
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            return false;
        }
    }
    
    private String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }
    
    private boolean isAllowedExtension(String extension) {
        String[] extensions = allowedExtensions.split(",");
        return Arrays.asList(extensions).contains(extension);
    }
    
    private String generateUniqueFileName(String originalFileName) {
        String timestamp = System.currentTimeMillis() + "";
        String uuid = UUID.randomUUID().toString();
        String extension = getFileExtension(originalFileName);
        return timestamp + "_" + uuid + "." + extension;
    }
}
