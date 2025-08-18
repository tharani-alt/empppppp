package com.employeems.controller;

import com.employeems.dto.DepartmentDto;
import com.employeems.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    @PreAuthorize("hasRole('HR_STAFF') or hasRole('HR_MANAGER') or hasRole('DEPARTMENT_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<DepartmentDto>> getAllDepartments() {
        List<DepartmentDto> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('HR_STAFF') or hasRole('HR_MANAGER') or hasRole('DEPARTMENT_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<DepartmentDto> getDepartmentById(@PathVariable Long id) {
        DepartmentDto department = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(department);
    }

    @GetMapping("/root")
    @PreAuthorize("hasRole('HR_STAFF') or hasRole('HR_MANAGER') or hasRole('DEPARTMENT_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<DepartmentDto>> getRootDepartments() {
        List<DepartmentDto> departments = departmentService.getRootDepartments();
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/{parentId}/sub-departments")
    @PreAuthorize("hasRole('HR_STAFF') or hasRole('HR_MANAGER') or hasRole('DEPARTMENT_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<DepartmentDto>> getSubDepartments(@PathVariable Long parentId) {
        List<DepartmentDto> departments = departmentService.getSubDepartments(parentId);
        return ResponseEntity.ok(departments);
    }

    @PostMapping
    @PreAuthorize("hasRole('HR_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<DepartmentDto> createDepartment(@Valid @RequestBody DepartmentDto departmentDto) {
        DepartmentDto createdDepartment = departmentService.createDepartment(departmentDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDepartment);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<DepartmentDto> updateDepartment(@PathVariable Long id, @Valid @RequestBody DepartmentDto departmentDto) {
        DepartmentDto updatedDepartment = departmentService.updateDepartment(id, departmentDto);
        return ResponseEntity.ok(updatedDepartment);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HR_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('HR_STAFF') or hasRole('HR_MANAGER') or hasRole('DEPARTMENT_MANAGER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<DepartmentDto>> searchDepartments(@RequestParam String q) {
        List<DepartmentDto> departments = departmentService.searchDepartments(q);
        return ResponseEntity.ok(departments);
    }
}
