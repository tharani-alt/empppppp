package com.employeems.dto;

import com.employeems.entity.Employee;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EmployeeDto {
    
    private Long id;
    
    @NotBlank(message = "Employee ID is required")
    private String employeeId;
    
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    private String phoneNumber;
    
    @NotNull(message = "Department is required")
    private Long departmentId;
    
    private String departmentName;
    
    @NotNull(message = "Designation is required")
    private Long designationId;
    
    private String designationTitle;
    
    private Employee.EmploymentType employmentType;
    
    private String previousEmployer;
    
    private LocalDate dateOfJoining;
    
    private LocalDate dateOfBirth;
    
    private String address;
    
    private Employee.EmployeeStatus status;
    
    private Long managerId;
    
    private String managerName;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;

    // Constructors
    public EmployeeDto() {}

    public EmployeeDto(Employee employee) {
        this.id = employee.getId();
        this.employeeId = employee.getEmployeeId();
        this.firstName = employee.getFirstName();
        this.lastName = employee.getLastName();
        this.email = employee.getEmail();
        this.phoneNumber = employee.getPhoneNumber();
        this.departmentId = employee.getDepartment() != null ? employee.getDepartment().getId() : null;
        this.departmentName = employee.getDepartment() != null ? employee.getDepartment().getName() : null;
        this.designationId = employee.getDesignation() != null ? employee.getDesignation().getId() : null;
        this.designationTitle = employee.getDesignation() != null ? employee.getDesignation().getTitle() : null;
        this.employmentType = employee.getEmploymentType();
        this.previousEmployer = employee.getPreviousEmployer();
        this.dateOfJoining = employee.getDateOfJoining();
        this.dateOfBirth = employee.getDateOfBirth();
        this.address = employee.getAddress();
        this.status = employee.getStatus();
        this.managerId = employee.getManager() != null ? employee.getManager().getId() : null;
        this.managerName = employee.getManager() != null ? employee.getManager().getFullName() : null;
        this.createdAt = employee.getCreatedAt();
        this.updatedAt = employee.getUpdatedAt();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public Long getDesignationId() { return designationId; }
    public void setDesignationId(Long designationId) { this.designationId = designationId; }

    public String getDesignationTitle() { return designationTitle; }
    public void setDesignationTitle(String designationTitle) { this.designationTitle = designationTitle; }

    public Employee.EmploymentType getEmploymentType() { return employmentType; }
    public void setEmploymentType(Employee.EmploymentType employmentType) { this.employmentType = employmentType; }

    public String getPreviousEmployer() { return previousEmployer; }
    public void setPreviousEmployer(String previousEmployer) { this.previousEmployer = previousEmployer; }

    public LocalDate getDateOfJoining() { return dateOfJoining; }
    public void setDateOfJoining(LocalDate dateOfJoining) { this.dateOfJoining = dateOfJoining; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Employee.EmployeeStatus getStatus() { return status; }
    public void setStatus(Employee.EmployeeStatus status) { this.status = status; }

    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
