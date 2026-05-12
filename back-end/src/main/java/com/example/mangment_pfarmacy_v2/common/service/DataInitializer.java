package com.example.mangment_pfarmacy_v2.common.service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mangment_pfarmacy_v2.abonnement.entity.Abonnement;
import com.example.mangment_pfarmacy_v2.abonnement.enums.StatutAbonnement;
import com.example.mangment_pfarmacy_v2.abonnement.repository.AbonnementRepository;
import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;
import com.example.mangment_pfarmacy_v2.pharmacie.repository.PharmacieRepository;
import com.example.mangment_pfarmacy_v2.plan.entity.PlanTarifaire;
import com.example.mangment_pfarmacy_v2.plan.repository.PlanTarifaireRepository;
import com.example.mangment_pfarmacy_v2.superadmin.entity.SuperAdmin;
import com.example.mangment_pfarmacy_v2.superadmin.repository.SuperAdminRepository;
import com.example.mangment_pfarmacy_v2.utilisateur.dto.SuperAdminInitDTO;
import com.example.mangment_pfarmacy_v2.utilisateur.entity.AdminPharmacie;
import com.example.mangment_pfarmacy_v2.utilisateur.enums.Role;
import com.example.mangment_pfarmacy_v2.utilisateur.repository.UtilisateurRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service d'initialisation des données SuperAdmin.
 * Crée le premier SuperAdmin, les plans tarifaires, et la pharmacie associée.
 */
@Slf4j
@Service
@Transactional
public class DataInitializer {

    @Autowired
    private SuperAdminRepository superAdminRepository;

    @Autowired
    private PlanTarifaireRepository planRepository;

    @Autowired
    private PharmacieRepository pharmacieRepository;

    @Autowired
    private AbonnementRepository abonnementRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${superadmin.init.secret}")
    private String initSecret;

    /**
     * Initialise les données de base : SuperAdmin, Plans tarifaires, Pharmacie, Abonnement
     * 
     * @param dto Contient les infos du SuperAdmin et de la pharmacie
     * @throws RuntimeException Si les données existent déjà ou si une erreur survient
     */
    public void initSuperAdmin(SuperAdminInitDTO dto) {
        log.info("Initialisation SuperAdmin et données de base");

        // Vérifie la clé secrète
        if (!initSecret.equals(dto.getInitSecret())) {
            log.warn("Tentative d'initialisation avec une mauvaise clé secrète");
            throw new RuntimeException("Clé d'initialisation invalide");
        }

        // Vérifie si le SuperAdmin existe déjà
        Optional<SuperAdmin> existingSuperAdmin = superAdminRepository.findByEmail(dto.getEmail());
        if (existingSuperAdmin.isPresent()) {
            log.warn("SuperAdmin existant: {}", dto.getEmail());
            throw new RuntimeException("Un SuperAdmin avec cet email existe déjà");
        }

        // Crée les plans tarifaires s'ils n'existent pas
        createDefaultPlans();

        // Crée le SuperAdmin
        SuperAdmin superAdmin = new SuperAdmin();
        superAdmin.setName(dto.getFirstName() + " " + dto.getLastName());
        superAdmin.setEmail(dto.getEmail());
        superAdmin.setPassword(passwordEncoder.encode(dto.getPassword()));
        superAdmin = superAdminRepository.save(superAdmin);
        log.info("SuperAdmin créé: {} ({})", superAdmin.getId(), superAdmin.getEmail());

        // Récupère le plan STARTER par défaut
        PlanTarifaire planStarter = planRepository.findByNom("STARTER")
                .orElseThrow(() -> new RuntimeException("Plan STARTER non trouvé"));

        // Crée l'abonnement
        Abonnement abonnement = new Abonnement();
        abonnement.setDateDebut(LocalDate.now().minusDays(1));
        abonnement.setDateFin(LocalDate.now().plusYears(1)); // Valide 1 an
        abonnement.setStatut(StatutAbonnement.ACTIF);
        abonnement.setPlan(planStarter);
        abonnement = abonnementRepository.save(abonnement);
        log.info("Abonnement créé: {} ({})", abonnement.getId(), abonnement.getStatut());

        // Crée la pharmacie
        Pharmacie pharmacie = new Pharmacie();
        pharmacie.setNom(dto.getPharmacyName());
        pharmacie.setAdresse(dto.getPharmacyAddress());
        pharmacie.setTelephone(dto.getPhoneNumber() != null ? dto.getPhoneNumber() : "");
        pharmacie.setTenantId(java.util.UUID.randomUUID().toString());
        pharmacie.setAbonnement(abonnement);
        pharmacie.setSuperAdmin(superAdmin);
        pharmacie = pharmacieRepository.save(pharmacie);
        log.info("Pharmacie créée: {} ({})", pharmacie.getId(), pharmacie.getNom());

        // Crée l'admin de la pharmacie
        AdminPharmacie adminPharmacie = new AdminPharmacie();
        adminPharmacie.setFirst_name(dto.getFirstName());
        adminPharmacie.setLast_name(dto.getLastName());
        adminPharmacie.setEmail(dto.getEmail());
        adminPharmacie.setPassword(passwordEncoder.encode(dto.getPassword()));
        adminPharmacie.setRole(Role.SUPER_ADMIN);
        adminPharmacie.setPharmacy(pharmacie);
        utilisateurRepository.save(adminPharmacie);
        log.info("SuperAdmin créé dans utilisateurs pour: {}", pharmacie.getNom());

        log.info("Initialisation SuperAdmin complétée avec succès");
    }

    /**
     * Crée les plans tarifaires par défaut
     */
    private void createDefaultPlans() {
        // STARTER
        if (!planRepository.findByNom("STARTER").isPresent()) {
            PlanTarifaire starter = new PlanTarifaire();
            starter.setNom("STARTER");
            starter.setPrixMensuel(29.99);
            starter.setMaxUtilisateurs(5);
            starter.setFeatures(Arrays.asList(
                "Gestion de base des stocks",
                "5 utilisateurs",
                "Support par email"
            ));
            planRepository.save(starter);
            log.info("Plan STARTER créé");
        }

        // PREMIUM
        if (!planRepository.findByNom("PREMIUM").isPresent()) {
            PlanTarifaire premium = new PlanTarifaire();
            premium.setNom("PREMIUM");
            premium.setPrixMensuel(79.99);
            premium.setMaxUtilisateurs(20);
            premium.setFeatures(Arrays.asList(
                "Gestion avancée des stocks",
                "Gestion des fournisseurs",
                "Rapports et analytiques",
                "20 utilisateurs",
                "Support prioritaire",
                "API REST"
            ));
            planRepository.save(premium);
            log.info("Plan PREMIUM créé");
        }

        // ENTERPRISE
        if (!planRepository.findByNom("ENTERPRISE").isPresent()) {
            PlanTarifaire enterprise = new PlanTarifaire();
            enterprise.setNom("ENTERPRISE");
            enterprise.setPrixMensuel(199.99);
            enterprise.setMaxUtilisateurs(100);
            enterprise.setFeatures(Arrays.asList(
                "Toutes les fonctionnalités",
                "Utilisateurs illimités",
                "Support 24/7",
                "Intégrations personnalisées",
                "Audit trail complet",
                "Backup quotidien"
            ));
            planRepository.save(enterprise);
            log.info("Plan ENTERPRISE créé");
        }
    }
}
