package com.employeems.config;

import com.employeems.service.RolePermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RolePermissionService rolePermissionService;

    @Override
    public void run(String... args) throws Exception {
        // Initialize default roles and permissions
        rolePermissionService.initializeDefaultRolesAndPermissions();
    }
}
