package com.example.mangment_pfarmacy_v2.superadmin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mangment_pfarmacy_v2.common.service.DataInitializer;
import com.example.mangment_pfarmacy_v2.utilisateur.dto.SuperAdminInitDTO;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

/**
 * Contrôleur SuperAdmin.
 * Endpoint public POST /superadmin/init pour créer le premier SuperAdmin et les données de base.
 * Protégé par une clé secrète dans application.yml.
 */
@Slf4j
@RestController
@RequestMapping("/superadmin")
public class SuperAdminController {

    @Autowired
    private DataInitializer dataInitializer;

    /**
     * Endpoint d'initialisation du SuperAdmin.
     * POST /superadmin/init
     * 
     * Crée :
     * - Le premier SuperAdmin
     * - Les plans tarifaires par défaut (STARTER, PREMIUM, ENTERPRISE)
     * - La pharmacie associée
     * - Un abonnement STARTER actif pour 1 an
     * - Un AdminPharmacie lié à la pharmacie
     * 
     * @param dto Contient les infos du SuperAdmin, pharmacie, et la clé secrète
     * @return Message de succès ou d'erreur
     */
    @PostMapping("/init")
    public ResponseEntity<?> initSuperAdmin(@Valid @RequestBody SuperAdminInitDTO dto) {
        try {
            log.info("Tentative d'initialisation SuperAdmin pour: {}", dto.getEmail());
            dataInitializer.initSuperAdmin(dto);
            
            return ResponseEntity.ok(new InitResponse(
                "Succès",
                "SuperAdmin, pharmacie et plans tarifaires créés avec succès"
            ));
        } catch (RuntimeException ex) {
            log.error("Erreur lors de l'initialisation SuperAdmin: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new InitResponse("Erreur", ex.getMessage()));
        } catch (Exception ex) {
            log.error("Erreur serveur lors de l'initialisation SuperAdmin", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new InitResponse("Erreur serveur", "Une erreur s'est produite"));
        }
    }

    /**
     * DTO pour les réponses d'initialisation
     */
    public static class InitResponse {
        public String status;
        public String message;

        public InitResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }

        public String getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }
    }
}

