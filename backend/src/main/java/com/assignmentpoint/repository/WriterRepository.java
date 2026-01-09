package com.assignmentpoint.repository;

import com.assignmentpoint.entity.Writer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface WriterRepository extends JpaRepository<Writer, Long> {
    Optional<Writer> findByUserId(Long userId);
    List<Writer> findByAvailabilityStatus(String status);
    List<Writer> findByWriterManagerId(Long managerId);
}
