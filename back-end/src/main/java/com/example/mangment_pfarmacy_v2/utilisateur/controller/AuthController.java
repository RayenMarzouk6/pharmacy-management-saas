package com.example.mangment_pfarmacy_v2.utilisateur.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mangment_pfarmacy_v2.common.exception.EmailAlreadyExistsException;
import com.example.mangment_pfarmacy_v2.utilisateur.dto.JwtResponseDTO;
import com.example.mangment_pfarmacy_v2.utilisateur.dto.LoginDTO;
import com.example.mangment_pfarmacy_v2.utilisateur.dto.RegisterDTO;
import com.example.mangment_pfarmacy_v2.utilisateur.service.AuthService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

/**
 * Contrôleur d'authentification.
 * Endpoints publics POST /auth/login et POST /auth/register.
 */
@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Endpoint public de connexion.
     * POST /auth/login
     * 
     * @param loginDTO Email et password
     * @return JWT token avec userId, pharmacieId, email et role
     */
    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
        log.info("Requête de connexion pour: {}", loginDTO.getEmail());
        return ResponseEntity.ok(authService.login(loginDTO));
    }

    @PostMapping("/register")
    public ResponseEntity<JwtResponseDTO> register(@Valid @RequestBody RegisterDTO registerDTO) {
        log.info("Requête d'inscription pour: {}", registerDTO.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(registerDTO));
    }
}
