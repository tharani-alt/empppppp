package com.employeems.controller;

import com.employeems.dto.EmployeeDto;
import com.employeems.entity.Employee;
import com.employeems.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    @PreAuthorize("hasRole('HR_STAFF') or hasRole('HR_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Page<EmployeeDto>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "firstName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<EmployeeDto> employees = employeeService.getAllEmployees(pageable);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('HR_STAFF') or hasRole('HR_MANAGER') or hasRole('SYSTEM_ADMIN') or @employeeService.isCurrentUser(#id)")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {
        EmployeeDto employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employee);
    }

    @GetMapping("/employee-id/{employeeId}")
    @PreAuthorize("hasRole('HR_STAFF') or hasRole('HR_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<EmployeeDto> getEmployeeByEmployeeId(@PathVariable String employeeId) {
        EmployeeDto employee = employeeService.getEmployeeByEmployeeId(employeeId);
        return ResponseEntity.ok(employee);
    }

    @PostMapping
    @PreAuthorize("hasRole('HR_STAFF') or hasRole('HR_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<EmployeeDto> createEmployee(@Valid @RequestBody EmployeeDto employeeDto) {
        EmployeeDto createdEmployee = employeeService.createEmployee(employeeDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEmployee);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR_STAFF') or hasRole('HR_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeDto employeeDto) {
        EmployeeDto updatedEmployee = employeeService.updateEmployee(id, employeeDto);
        return ResponseEntity.ok(updatedEmployee);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HR_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('HR_STAFF') or hasRole('HR_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Page<EmployeeDto>> searchEmployees(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<EmployeeDto> employees = employeeService.searchEmployees(q, pageable);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasRole('HR_STAFF') or hasRole('HR_MANAGER') or hasRole('DEPARTMENT_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Page<EmployeeDto>> getEmployeesByDepartment(
            @PathVariable Long departmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<EmployeeDto> employees = employeeService.getEmployeesByDepartment(departmentId, pageable);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/designation/{designationId}")
    @PreAuthorize("hasRole('HR_STAFF') or hasRole('HR_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Page<EmployeeDto>> getEmployeesByDesignation(
            @PathVariable Long designationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<EmployeeDto> employees = employeeService.getEmployeesByDesignation(designationId, pageable);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('HR_STAFF') or hasRole('HR_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Page<EmployeeDto>> getEmployeesByStatus(
            @PathVariable Employee.EmployeeStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<EmployeeDto> employees = employeeService.getEmployeesByStatus(status, pageable);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/manager/{managerId}")
    @PreAuthorize("hasRole('HR_STAFF') or hasRole('HR_MANAGER') or hasRole('DEPARTMENT_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<EmployeeDto>> getEmployeesByManager(@PathVariable Long managerId) {
        List<EmployeeDto> employees = employeeService.getEmployeesByManager(managerId);
        return ResponseEntity.ok(employees);
    }
}
