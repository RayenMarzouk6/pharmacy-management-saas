package com.example.mangment_pfarmacy_v2.utilisateur.dto;

import java.util.UUID;

import com.example.mangment_pfarmacy_v2.utilisateur.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtResponseDTO {

    private String token;
    @Builder.Default
    private String type = "Bearer";
    private UUID userId;
    private UUID pharmacieId;
    private String email;
    private Role role;
    private Long expiresIn;
    private String dashboardPath;

    public JwtResponseDTO(String token, Long expiresIn, UUID userId, UUID pharmacieId, 
                         String email, Role role) {
        this(token, expiresIn, userId, pharmacieId, email, role, null);
    }

    public JwtResponseDTO(String token, Long expiresIn, UUID userId, UUID pharmacieId,
                          String email, Role role, String dashboardPath) {
        this.token = token;
        this.type = "Bearer";
        this.expiresIn = expiresIn;
        this.userId = userId;
        this.pharmacieId = pharmacieId;
        this.email = email;
        this.role = role;
        this.dashboardPath = dashboardPath;
    }
}
