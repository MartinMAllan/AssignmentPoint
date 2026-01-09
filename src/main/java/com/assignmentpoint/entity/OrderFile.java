package com.assignmentpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_files")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderFile extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;
    
    @Column(nullable = false)
    private String fileName;
    
    @Column(nullable = false)
    private String fileUrl;
    
    private Long fileSize;
    private String fileType;
    
    @Enumerated(EnumType.STRING)
    private FileCategory fileCategory;
    
    @Column(columnDefinition = "boolean default false")
    private Boolean isSeen = false;
    
    private LocalDateTime seenAt;
    
    public enum FileCategory {
        INSTRUCTION, ATTACHMENT, DRAFT, FINAL, REVISION, ADDITIONAL
    }
}
