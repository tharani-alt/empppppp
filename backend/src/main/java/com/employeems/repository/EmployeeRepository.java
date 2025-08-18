package com.employeems.repository;

import com.employeems.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByEmployeeId(String employeeId);
    
    Optional<Employee> findByEmail(String email);
    
    List<Employee> findByDepartmentId(Long departmentId);
    
    List<Employee> findByDesignationId(Long designationId);
    
    List<Employee> findByManagerId(Long managerId);
    
    @Query("SELECT e FROM Employee e WHERE " +
           "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.employeeId) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Employee> searchEmployees(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT e FROM Employee e WHERE e.department.id = :departmentId")
    Page<Employee> findByDepartmentId(@Param("departmentId") Long departmentId, Pageable pageable);
    
    @Query("SELECT e FROM Employee e WHERE e.designation.id = :designationId")
    Page<Employee> findByDesignationId(@Param("designationId") Long designationId, Pageable pageable);
    
    @Query("SELECT e FROM Employee e WHERE e.status = :status")
    Page<Employee> findByStatus(@Param("status") Employee.EmployeeStatus status, Pageable pageable);
    
    boolean existsByEmployeeId(String employeeId);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.department.id = :departmentId")
    Long countByDepartmentId(@Param("departmentId") Long departmentId);
}
