package com.employeems.service;

import com.employeems.dto.DepartmentDto;
import com.employeems.entity.Department;
import com.employeems.entity.Employee;
import com.employeems.repository.DepartmentRepository;
import com.employeems.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(DepartmentDto::new)
                .collect(Collectors.toList());
    }

    public DepartmentDto getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
        return new DepartmentDto(department);
    }

    public List<DepartmentDto> getRootDepartments() {
        return departmentRepository.findByParentDepartmentIsNull().stream()
                .map(DepartmentDto::new)
                .collect(Collectors.toList());
    }

    public List<DepartmentDto> getSubDepartments(Long parentId) {
        return departmentRepository.findByParentDepartmentId(parentId).stream()
                .map(DepartmentDto::new)
                .collect(Collectors.toList());
    }

    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        if (departmentRepository.existsByName(departmentDto.getName())) {
            throw new RuntimeException("Department name already exists: " + departmentDto.getName());
        }
        if (departmentRepository.existsByCode(departmentDto.getCode())) {
            throw new RuntimeException("Department code already exists: " + departmentDto.getCode());
        }

        Department department = new Department();
        updateDepartmentFromDto(department, departmentDto);
        
        department = departmentRepository.save(department);
        return new DepartmentDto(department);
    }

    public DepartmentDto updateDepartment(Long id, DepartmentDto departmentDto) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));

        // Check if name or code is being changed and already exists
        if (!department.getName().equals(departmentDto.getName()) && 
            departmentRepository.existsByName(departmentDto.getName())) {
            throw new RuntimeException("Department name already exists: " + departmentDto.getName());
        }
        if (!department.getCode().equals(departmentDto.getCode()) && 
            departmentRepository.existsByCode(departmentDto.getCode())) {
            throw new RuntimeException("Department code already exists: " + departmentDto.getCode());
        }

        updateDepartmentFromDto(department, departmentDto);
        department = departmentRepository.save(department);
        return new DepartmentDto(department);
    }

    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));

        // Check if department has employees
        Long employeeCount = employeeRepository.countByDepartmentId(id);
        if (employeeCount > 0) {
            throw new RuntimeException("Cannot delete department with existing employees. Please reassign employees first.");
        }

        // Check if department has sub-departments
        Long subDepartmentCount = departmentRepository.countSubDepartments(id);
        if (subDepartmentCount > 0) {
            throw new RuntimeException("Cannot delete department with sub-departments. Please delete or reassign sub-departments first.");
        }

        departmentRepository.deleteById(id);
    }

    public List<DepartmentDto> searchDepartments(String searchTerm) {
        return departmentRepository.searchDepartments(searchTerm).stream()
                .map(DepartmentDto::new)
                .collect(Collectors.toList());
    }

    private void updateDepartmentFromDto(Department department, DepartmentDto dto) {
        department.setName(dto.getName());
        department.setDescription(dto.getDescription());
        department.setCode(dto.getCode());
        department.setLocation(dto.getLocation());
        department.setCostCenter(dto.getCostCenter());
        department.setStatus(dto.getStatus() != null ? dto.getStatus() : Department.DepartmentStatus.ACTIVE);

        // Set manager
        if (dto.getManagerId() != null) {
            Employee manager = employeeRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new RuntimeException("Manager not found with id: " + dto.getManagerId()));
            department.setManager(manager);
        }

        // Set parent department
        if (dto.getParentDepartmentId() != null) {
            Department parentDepartment = departmentRepository.findById(dto.getParentDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Parent department not found with id: " + dto.getParentDepartmentId()));
            department.setParentDepartment(parentDepartment);
        }
    }
}
