package com.employeems.repository;

import com.employeems.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DesignationRepository extends JpaRepository<Designation, Long> {
    
    Optional<Designation> findByTitle(String title);
    
    Optional<Designation> findByCode(String code);
    
    List<Designation> findByDepartmentId(Long departmentId);
    
    List<Designation> findByLevel(Integer level);
    
    @Query("SELECT d FROM Designation d WHERE " +
           "LOWER(d.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.code) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Designation> searchDesignations(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT d FROM Designation d ORDER BY d.level ASC")
    List<Designation> findAllOrderByLevel();
    
    boolean existsByTitle(String title);
    
    boolean existsByCode(String code);
}
