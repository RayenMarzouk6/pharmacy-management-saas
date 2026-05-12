package com.example.mangment_pfarmacy_v2.utilisateur.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.mangment_pfarmacy_v2.abonnement.entity.Abonnement;
import com.example.mangment_pfarmacy_v2.abonnement.enums.StatutAbonnement;
import com.example.mangment_pfarmacy_v2.abonnement.repository.AbonnementRepository;
import com.example.mangment_pfarmacy_v2.common.exception.AbonnementExpireException;
import com.example.mangment_pfarmacy_v2.common.exception.EmailAlreadyExistsException;
import com.example.mangment_pfarmacy_v2.common.exception.InvalidCredentialsException;
import com.example.mangment_pfarmacy_v2.common.security.JwtTokenProvider;
import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;
import com.example.mangment_pfarmacy_v2.pharmacie.repository.PharmacieRepository;
import com.example.mangment_pfarmacy_v2.plan.entity.PlanTarifaire;
import com.example.mangment_pfarmacy_v2.plan.repository.PlanTarifaireRepository;
import com.example.mangment_pfarmacy_v2.utilisateur.dto.JwtResponseDTO;
import com.example.mangment_pfarmacy_v2.utilisateur.dto.LoginDTO;
import com.example.mangment_pfarmacy_v2.utilisateur.dto.RegisterDTO;
import com.example.mangment_pfarmacy_v2.utilisateur.entity.Utilisateur;
import com.example.mangment_pfarmacy_v2.utilisateur.entity.AdminPharmacie;
import com.example.mangment_pfarmacy_v2.utilisateur.enums.Role;
import com.example.mangment_pfarmacy_v2.utilisateur.repository.UtilisateurRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service d'authentification.
 * Valide les credentials et retourne un JWT avec userId + role + pharmacieId.
 */
@Slf4j
@Service
@Transactional
public class AuthService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PharmacieRepository pharmacieRepository;

    @Autowired
    private PlanTarifaireRepository planTarifaireRepository;

    @Autowired
    private AbonnementRepository abonnementRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Authentifie un utilisateur et retourne un JWT token
     * 
     * @param loginDTO Contient email et password
     * @return JwtResponseDTO avec le token et les infos de l'utilisateur
     * @throws RuntimeException Si l'email n'existe pas ou le mot de passe est
     *                          incorrect
     */
    public JwtResponseDTO login(LoginDTO loginDTO) {
        log.info("Tentative de connexion pour l'utilisateur: {}", loginDTO.getEmail());

        // Récupère l'utilisateur par email
        Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findByEmail(loginDTO.getEmail());

        if (!utilisateurOpt.isPresent()) {
            log.warn("Utilisateur non trouvé: {}", loginDTO.getEmail());
            throw new InvalidCredentialsException("Email ou mot de passe incorrect");
        }

        Utilisateur utilisateur = utilisateurOpt.get();

        // Valide le mot de passe
        if (!passwordEncoder.matches(loginDTO.getPassword(), utilisateur.getPassword())) {
            log.warn("Mot de passe incorrect pour: {}", loginDTO.getEmail());
            throw new InvalidCredentialsException("Email ou mot de passe incorrect");
        }

        // Vérifie que l'abonnement est valide
        Pharmacie pharmacie = utilisateur.getPharmacy();
        if (pharmacie == null || !pharmacie.isAbonnementActif()) {
            log.warn("Abonnement expiré pour l'utilisateur: {}", loginDTO.getEmail());
            throw new AbonnementExpireException("L'abonnement de votre pharmacie a expiré");
        }

        // Génère le JWT token
        String token = jwtTokenProvider.generateToken(
                utilisateur.getId(),
                pharmacie.getId(),
                utilisateur.getEmail(),
                utilisateur.getRole().name());

        log.info("Connexion réussie pour: {}", loginDTO.getEmail());

        return new JwtResponseDTO(
                token,
                jwtTokenProvider.getExpirationMs(),
                utilisateur.getId(),
                pharmacie.getId(),
                utilisateur.getEmail(),
                utilisateur.getRole(),
                resolveDashboardPath(utilisateur.getRole()));
    }

    public JwtResponseDTO register(RegisterDTO registerDTO) {
        String normalizedEmail = registerDTO.getEmail().trim().toLowerCase();

        if (utilisateurRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyExistsException("Un utilisateur avec cet email existe deja");
        }

        PlanTarifaire starterPlan = planTarifaireRepository.findByNom("STARTER")
                .orElseGet(() -> planTarifaireRepository.save(createStarterPlan()));

        Abonnement abonnement = createTrialAbonnement(starterPlan);
        abonnement = abonnementRepository.save(abonnement);

        Pharmacie pharmacie = new Pharmacie();
        String nomPharm = registerDTO.getPharmacyName() != null && !registerDTO.getPharmacyName().isBlank()
                ? registerDTO.getPharmacyName().trim()
                : buildPharmacyName(registerDTO);
        pharmacie.setNom(nomPharm);
        pharmacie.setAdresse(registerDTO.getPharmacyAddress() != null ? registerDTO.getPharmacyAddress().trim() : "");
        pharmacie.setTelephone(registerDTO.getPhoneNumber() != null ? registerDTO.getPhoneNumber().trim() : "");
        pharmacie.setTenantId(UUID.randomUUID().toString());
        pharmacie.setAbonnement(abonnement);
        pharmacie = pharmacieRepository.save(pharmacie);

        AdminPharmacie admin = new AdminPharmacie();
        admin.setFirst_name(registerDTO.getFirstName().trim());
        admin.setLast_name(registerDTO.getLastName().trim());
        admin.setEmail(normalizedEmail);
        admin.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        admin.setRole(Role.ADMIN);
        admin.setPharmacy(pharmacie);
        admin = (AdminPharmacie) utilisateurRepository.save(admin);

        abonnement.setPharmacie(pharmacie);
        abonnementRepository.save(abonnement);

        String token = jwtTokenProvider.generateToken(
            admin.getId(),
            pharmacie.getId(),
            admin.getEmail(),
            admin.getRole().name());

        return new JwtResponseDTO(
            token,
            jwtTokenProvider.getExpirationMs(),
            admin.getId(),
            pharmacie.getId(),
            admin.getEmail(),
            admin.getRole(),
            resolveDashboardPath(admin.getRole()));
    }

    private String resolveDashboardPath(Role role) {
        if (role == null) {
            return "/pharmacien/dashboard";
        }

        return switch (role) {
            case SUPER_ADMIN -> "/superadmin/dashboard";
            case ADMIN -> "/admin/dashboard";
            case PHARMACIEN -> "/pharmacien/dashboard";
        };
    }

    private PlanTarifaire createStarterPlan() {
        PlanTarifaire starter = new PlanTarifaire();
        starter.setNom("STARTER");
        starter.setPrixMensuel(0.0);
        starter.setMaxUtilisateurs(3);
        starter.setFeatures(List.of(
                "Gestion de base des stocks",
                "3 utilisateurs",
                "Acces JWT securise"));
        return starter;
    }

    private Abonnement createTrialAbonnement(PlanTarifaire plan) {
        Abonnement abonnement = new Abonnement();
        abonnement.setDateDebut(LocalDate.now().minusDays(1));
        abonnement.setDateFin(LocalDate.now().plusDays(30));
        abonnement.setStatut(StatutAbonnement.ACTIF);
        abonnement.setPlan(plan);
        return abonnement;
    }

    private String buildPharmacyName(RegisterDTO registerDTO) {
        return "Pharmacie de " + registerDTO.getFirstName().trim() + " " + registerDTO.getLastName().trim();
    }
}
