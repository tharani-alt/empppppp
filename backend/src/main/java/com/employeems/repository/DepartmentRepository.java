package com.employeems.repository;

import com.employeems.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    
    Optional<Department> findByName(String name);
    
    Optional<Department> findByCode(String code);
    
    List<Department> findByParentDepartmentId(Long parentDepartmentId);
    
    List<Department> findByParentDepartmentIsNull(); // Root departments
    
    @Query("SELECT d FROM Department d WHERE " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.code) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Department> searchDepartments(@Param("searchTerm") String searchTerm);
    
    boolean existsByName(String name);
    
    boolean existsByCode(String code);
    
    @Query("SELECT COUNT(d) FROM Department d WHERE d.parentDepartment.id = :parentId")
    Long countSubDepartments(@Param("parentId") Long parentId);
}
