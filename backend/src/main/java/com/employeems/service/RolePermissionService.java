package com.employeems.service;

import com.employeems.entity.Permission;
import com.employeems.entity.Role;
import com.employeems.repository.PermissionRepository;
import com.employeems.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class RolePermissionService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    public void initializeDefaultRolesAndPermissions() {
        // Create permissions if they don't exist
        createPermissionIfNotExists("EMPLOYEE_READ", "Read Employee Data", Permission.PermissionCategory.EMPLOYEE_MANAGEMENT);
        createPermissionIfNotExists("EMPLOYEE_WRITE", "Create/Update Employee Data", Permission.PermissionCategory.EMPLOYEE_MANAGEMENT);
        createPermissionIfNotExists("EMPLOYEE_DELETE", "Delete Employee Data", Permission.PermissionCategory.EMPLOYEE_MANAGEMENT);
        createPermissionIfNotExists("DEPARTMENT_READ", "Read Department Data", Permission.PermissionCategory.DEPARTMENT_MANAGEMENT);
        createPermissionIfNotExists("DEPARTMENT_WRITE", "Create/Update Department Data", Permission.PermissionCategory.DEPARTMENT_MANAGEMENT);
        createPermissionIfNotExists("DEPARTMENT_DELETE", "Delete Department Data", Permission.PermissionCategory.DEPARTMENT_MANAGEMENT);
        createPermissionIfNotExists("USER_READ", "Read User Data", Permission.PermissionCategory.USER_MANAGEMENT);
        createPermissionIfNotExists("USER_WRITE", "Create/Update User Data", Permission.PermissionCategory.USER_MANAGEMENT);
        createPermissionIfNotExists("USER_DELETE", "Delete User Data", Permission.PermissionCategory.USER_MANAGEMENT);
        createPermissionIfNotExists("SYSTEM_ADMIN", "System Administration", Permission.PermissionCategory.SYSTEM_ADMINISTRATION);
        createPermissionIfNotExists("REPORTS_READ", "View Reports", Permission.PermissionCategory.REPORTING);
        createPermissionIfNotExists("AUDIT_READ", "View Audit Logs", Permission.PermissionCategory.AUDIT);

        // Create roles if they don't exist
        createRoleWithPermissions("EMPLOYEE", "EMPLOYEE", "Basic Employee Role", 
            Set.of("EMPLOYEE_READ"));
        
        createRoleWithPermissions("HR_STAFF", "HR_STAFF", "HR Staff Role", 
            Set.of("EMPLOYEE_READ", "EMPLOYEE_WRITE", "DEPARTMENT_READ", "USER_READ"));
        
        createRoleWithPermissions("HR_MANAGER", "HR_MANAGER", "HR Manager Role", 
            Set.of("EMPLOYEE_READ", "EMPLOYEE_WRITE", "EMPLOYEE_DELETE", "DEPARTMENT_READ", 
                   "DEPARTMENT_WRITE", "USER_READ", "USER_WRITE", "REPORTS_READ"));
        
        createRoleWithPermissions("DEPARTMENT_MANAGER", "DEPARTMENT_MANAGER", "Department Manager Role", 
            Set.of("EMPLOYEE_READ", "DEPARTMENT_READ", "REPORTS_READ"));
        
        createRoleWithPermissions("SYSTEM_ADMIN", "SYSTEM_ADMIN", "System Administrator Role", 
            Set.of("EMPLOYEE_READ", "EMPLOYEE_WRITE", "EMPLOYEE_DELETE", "DEPARTMENT_READ", 
                   "DEPARTMENT_WRITE", "DEPARTMENT_DELETE", "USER_READ", "USER_WRITE", "USER_DELETE",
                   "SYSTEM_ADMIN", "REPORTS_READ", "AUDIT_READ"));
        
        createRoleWithPermissions("GUEST", "GUEST", "Guest Role", Set.of());
    }

    private void createPermissionIfNotExists(String code, String name, Permission.PermissionCategory category) {
        if (!permissionRepository.existsByCode(code)) {
            Permission permission = new Permission(name, code, category);
            permissionRepository.save(permission);
        }
    }

    private void createRoleWithPermissions(String name, String code, String description, Set<String> permissionCodes) {
        if (!roleRepository.existsByCode(code)) {
            Role role = new Role(name, code);
            role.setDescription(description);
            
            Set<Permission> permissions = new HashSet<>();
            for (String permissionCode : permissionCodes) {
                Permission permission = permissionRepository.findByCode(permissionCode).orElse(null);
                if (permission != null) {
                    permissions.add(permission);
                }
            }
            role.setPermissions(permissions);
            
            roleRepository.save(role);
        }
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    public Role getRoleByCode(String code) {
        return roleRepository.findByCode(code).orElse(null);
    }

    public Permission getPermissionByCode(String code) {
        return permissionRepository.findByCode(code).orElse(null);
    }
}
