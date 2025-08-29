package com.saumajit.tprm.grc.controller;

import com.saumajit.tprm.grc.config.JwtUtil;
import com.saumajit.tprm.grc.dto.AuthRequest;
import com.saumajit.tprm.grc.dto.AuthResponse;
import com.saumajit.tprm.grc.dto.RegisterRequest;
import com.saumajit.tprm.grc.model.User;
import com.saumajit.tprm.grc.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request);
            
            // Generate JWT token for the new user
            UserDetails userDetails = userService.loadUserByUsername(user.getUsername());
            String token = jwtUtil.generateToken(userDetails);
            
            AuthResponse response = new AuthResponse(token, user);
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Registration error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Registration failed");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsernameOrEmail(),
                            request.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userService.findByUsername(userDetails.getUsername());
            
            // Update last login
            userService.updateLastLogin(user.getUsername());
            
            // Generate JWT token
            String token = jwtUtil.generateToken(userDetails);
            
            AuthResponse response = new AuthResponse(token, user);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Login failed for user: {}", request.getUsernameOrEmail(), e);
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Not authenticated");
            }
            
            User user = userService.findByUsername(authentication.getName());
            return ResponseEntity.ok(user);
            
        } catch (Exception e) {
            log.error("Error getting current user: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error retrieving user information");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Since we're using stateless JWT, logout is handled client-side
        // by removing the token from storage
        return ResponseEntity.ok("Logged out successfully");
    }
}
