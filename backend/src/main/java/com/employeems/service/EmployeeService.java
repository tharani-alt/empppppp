package com.employeems.service;

import com.employeems.dto.EmployeeDto;
import com.employeems.entity.Department;
import com.employeems.entity.Designation;
import com.employeems.entity.Employee;
import com.employeems.repository.DepartmentRepository;
import com.employeems.repository.DesignationRepository;
import com.employeems.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DesignationRepository designationRepository;

    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(EmployeeDto::new)
                .collect(Collectors.toList());
    }

    public Page<EmployeeDto> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable)
                .map(EmployeeDto::new);
    }

    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        return new EmployeeDto(employee);
    }

    public EmployeeDto getEmployeeByEmployeeId(String employeeId) {
        Employee employee = employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with employee ID: " + employeeId));
        return new EmployeeDto(employee);
    }

    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        // Validate unique constraints
        if (employeeRepository.existsByEmployeeId(employeeDto.getEmployeeId())) {
            throw new RuntimeException("Employee ID already exists: " + employeeDto.getEmployeeId());
        }
        if (employeeRepository.existsByEmail(employeeDto.getEmail())) {
            throw new RuntimeException("Email already exists: " + employeeDto.getEmail());
        }

        Employee employee = new Employee();
        updateEmployeeFromDto(employee, employeeDto);
        
        employee = employeeRepository.save(employee);
        return new EmployeeDto(employee);
    }

    public EmployeeDto updateEmployee(Long id, EmployeeDto employeeDto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        // Check if employee ID or email is being changed and already exists
        if (!employee.getEmployeeId().equals(employeeDto.getEmployeeId()) && 
            employeeRepository.existsByEmployeeId(employeeDto.getEmployeeId())) {
            throw new RuntimeException("Employee ID already exists: " + employeeDto.getEmployeeId());
        }
        if (!employee.getEmail().equals(employeeDto.getEmail()) && 
            employeeRepository.existsByEmail(employeeDto.getEmail())) {
            throw new RuntimeException("Email already exists: " + employeeDto.getEmail());
        }

        updateEmployeeFromDto(employee, employeeDto);
        employee = employeeRepository.save(employee);
        return new EmployeeDto(employee);
    }

    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }

    public Page<EmployeeDto> searchEmployees(String searchTerm, Pageable pageable) {
        return employeeRepository.searchEmployees(searchTerm, pageable)
                .map(EmployeeDto::new);
    }

    public Page<EmployeeDto> getEmployeesByDepartment(Long departmentId, Pageable pageable) {
        return employeeRepository.findByDepartmentId(departmentId, pageable)
                .map(EmployeeDto::new);
    }

    public Page<EmployeeDto> getEmployeesByDesignation(Long designationId, Pageable pageable) {
        return employeeRepository.findByDesignationId(designationId, pageable)
                .map(EmployeeDto::new);
    }

    public Page<EmployeeDto> getEmployeesByStatus(Employee.EmployeeStatus status, Pageable pageable) {
        return employeeRepository.findByStatus(status, pageable)
                .map(EmployeeDto::new);
    }

    public List<EmployeeDto> getEmployeesByManager(Long managerId) {
        return employeeRepository.findByManagerId(managerId).stream()
                .map(EmployeeDto::new)
                .collect(Collectors.toList());
    }

    private void updateEmployeeFromDto(Employee employee, EmployeeDto dto) {
        employee.setEmployeeId(dto.getEmployeeId());
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPhoneNumber(dto.getPhoneNumber());
        employee.setEmploymentType(dto.getEmploymentType());
        employee.setPreviousEmployer(dto.getPreviousEmployer());
        employee.setDateOfJoining(dto.getDateOfJoining());
        employee.setDateOfBirth(dto.getDateOfBirth());
        employee.setAddress(dto.getAddress());
        employee.setStatus(dto.getStatus() != null ? dto.getStatus() : Employee.EmployeeStatus.ACTIVE);

        // Set department
        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found with id: " + dto.getDepartmentId()));
            employee.setDepartment(department);
        }

        // Set designation
        if (dto.getDesignationId() != null) {
            Designation designation = designationRepository.findById(dto.getDesignationId())
                    .orElseThrow(() -> new RuntimeException("Designation not found with id: " + dto.getDesignationId()));
            employee.setDesignation(designation);
        }

        // Set manager
        if (dto.getManagerId() != null) {
            Employee manager = employeeRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new RuntimeException("Manager not found with id: " + dto.getManagerId()));
            employee.setManager(manager);
        }
    }
}
