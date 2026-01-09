package com.assignmentpoint.repository;

import com.assignmentpoint.entity.Writer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WriterRepository extends JpaRepository<Writer, Long> {
    Optional<Writer> findByUserId(Long userId);
    List<Writer> findByAvailabilityStatus(Writer.AvailabilityStatus status);
    
    @Query("SELECT w FROM Writer w WHERE w.rating >= :minRating AND w.availabilityStatus = 'AVAILABLE'")
    List<Writer> findAvailableWritersByMinRating(@Param("minRating") Double minRating);
    
    @Query("SELECT w FROM Writer w WHERE :specialization MEMBER OF w.specializations")
    List<Writer> findBySpecialization(@Param("specialization") String specialization);
}
