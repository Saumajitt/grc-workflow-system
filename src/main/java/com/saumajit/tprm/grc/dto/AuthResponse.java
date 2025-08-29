package com.saumajit.tprm.grc.dto;

import com.saumajit.tprm.grc.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String organization;
    private User.Role role;
    
    public AuthResponse(String token, User user) {
        this.token = token;
        this.userId = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.organization = user.getOrganization();
        this.role = user.getRole();
    }
}
