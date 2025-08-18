package com.employeems.service;

import com.employeems.dto.AuthResponse;
import com.employeems.dto.LoginRequest;
import com.employeems.dto.RegisterRequest;
import com.employeems.entity.User;
import com.employeems.repository.UserRepository;
import com.employeems.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    public AuthResponse login(LoginRequest loginRequest) {
        try {
            // Authenticate user
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getIdentifier(), loginRequest.getPassword())
            );

            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getIdentifier());
            
            // Find user entity
            User user = userRepository.findByUsernameOrEmailOrEmployeeId(loginRequest.getIdentifier())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            // Update last login time
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);

            // Generate tokens
            String accessToken = jwtUtil.generateToken(userDetails);
            String refreshToken = jwtUtil.generateRefreshToken(userDetails);

            return new AuthResponse(accessToken, refreshToken, jwtExpiration, new AuthResponse.UserInfo(user));

        } catch (Exception e) {
            throw new BadCredentialsException("Invalid credentials");
        }
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        // Check if user already exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (registerRequest.getEmployeeId() != null && userRepository.existsByEmployeeId(registerRequest.getEmployeeId())) {
            throw new RuntimeException("Employee ID already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setHashedPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmployeeId(registerRequest.getEmployeeId());
        user.setDepartment(registerRequest.getDepartment());
        user.setRole(registerRequest.getRole());
        user.setStatus(User.UserStatus.ACTIVE);

        user = userRepository.save(user);

        // Generate tokens
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String accessToken = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        return new AuthResponse(accessToken, refreshToken, jwtExpiration, new AuthResponse.UserInfo(user));
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String username = jwtUtil.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        User user = userRepository.findByUsernameOrEmail(username, username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtUtil.generateToken(userDetails);
        String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);

        return new AuthResponse(newAccessToken, newRefreshToken, jwtExpiration, new AuthResponse.UserInfo(user));
    }

    public void logout(String token) {
        // In a production system, you would add the token to a blacklist
        // For now, we'll just acknowledge the logout
        // TODO: Implement token blacklisting
    }
}
