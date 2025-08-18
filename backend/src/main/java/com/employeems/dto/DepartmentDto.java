package com.employeems.dto;

import com.employeems.entity.Department;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class DepartmentDto {
    
    private Long id;
    
    @NotBlank(message = "Department name is required")
    private String name;
    
    private String description;
    
    @NotBlank(message = "Department code is required")
    private String code;
    
    private Long managerId;
    
    private String managerName;
    
    private Long parentDepartmentId;
    
    private String parentDepartmentName;
    
    private List<DepartmentDto> subDepartments;
    
    private String location;
    
    private String costCenter;
    
    private Department.DepartmentStatus status;
    
    private Long employeeCount;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;

    // Constructors
    public DepartmentDto() {}

    public DepartmentDto(Department department) {
        this.id = department.getId();
        this.name = department.getName();
        this.description = department.getDescription();
        this.code = department.getCode();
        this.managerId = department.getManager() != null ? department.getManager().getId() : null;
        this.managerName = department.getManager() != null ? department.getManager().getFullName() : null;
        this.parentDepartmentId = department.getParentDepartment() != null ? department.getParentDepartment().getId() : null;
        this.parentDepartmentName = department.getParentDepartment() != null ? department.getParentDepartment().getName() : null;
        this.location = department.getLocation();
        this.costCenter = department.getCostCenter();
        this.status = department.getStatus();
        this.employeeCount = department.getEmployees() != null ? (long) department.getEmployees().size() : 0L;
        this.createdAt = department.getCreatedAt();
        this.updatedAt = department.getUpdatedAt();
        
        if (department.getSubDepartments() != null) {
            this.subDepartments = department.getSubDepartments().stream()
                .map(DepartmentDto::new)
                .collect(Collectors.toList());
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public Long getParentDepartmentId() { return parentDepartmentId; }
    public void setParentDepartmentId(Long parentDepartmentId) { this.parentDepartmentId = parentDepartmentId; }

    public String getParentDepartmentName() { return parentDepartmentName; }
    public void setParentDepartmentName(String parentDepartmentName) { this.parentDepartmentName = parentDepartmentName; }

    public List<DepartmentDto> getSubDepartments() { return subDepartments; }
    public void setSubDepartments(List<DepartmentDto> subDepartments) { this.subDepartments = subDepartments; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCostCenter() { return costCenter; }
    public void setCostCenter(String costCenter) { this.costCenter = costCenter; }

    public Department.DepartmentStatus getStatus() { return status; }
    public void setStatus(Department.DepartmentStatus status) { this.status = status; }

    public Long getEmployeeCount() { return employeeCount; }
    public void setEmployeeCount(Long employeeCount) { this.employeeCount = employeeCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
