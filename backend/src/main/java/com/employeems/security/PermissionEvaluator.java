package com.employeems.security;

import com.employeems.entity.Permission;
import com.employeems.entity.User;
import com.employeems.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class PermissionEvaluator {

    @Autowired
    private UserRepository userRepository;

    public boolean hasPermission(Authentication authentication, String permission) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        
        if (user == null || user.getRole() == null) {
            return false;
        }

        Set<String> userPermissions = user.getRole().getPermissions().stream()
                .map(Permission::getCode)
                .collect(Collectors.toSet());

        return userPermissions.contains(permission);
    }

    public boolean hasAnyPermission(Authentication authentication, String... permissions) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        
        if (user == null || user.getRole() == null) {
            return false;
        }

        Set<String> userPermissions = user.getRole().getPermissions().stream()
                .map(Permission::getCode)
                .collect(Collectors.toSet());

        for (String permission : permissions) {
            if (userPermissions.contains(permission)) {
                return true;
            }
        }
        return false;
    }

    public boolean isOwnerOrHasPermission(Authentication authentication, Long userId, String permission) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        
        if (user == null) {
            return false;
        }

        // Check if user is accessing their own data
        if (user.getId().equals(userId)) {
            return true;
        }

        // Check if user has the required permission
        return hasPermission(authentication, permission);
    }
}
