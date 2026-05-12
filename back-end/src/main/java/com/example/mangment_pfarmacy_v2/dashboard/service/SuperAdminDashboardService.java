package com.example.mangment_pfarmacy_v2.dashboard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mangment_pfarmacy_v2.abonnement.enums.StatutAbonnement;
import com.example.mangment_pfarmacy_v2.abonnement.repository.AbonnementRepository;
import com.example.mangment_pfarmacy_v2.dashboard.dto.SuperAdminDashboardDTO;
import com.example.mangment_pfarmacy_v2.pharmacie.repository.PharmacieRepository;
import com.example.mangment_pfarmacy_v2.plan.repository.PlanTarifaireRepository;
import com.example.mangment_pfarmacy_v2.superadmin.repository.SuperAdminRepository;
import com.example.mangment_pfarmacy_v2.utilisateur.enums.Role;
import com.example.mangment_pfarmacy_v2.utilisateur.repository.UtilisateurRepository;
import com.example.mangment_pfarmacy_v2.vente.repository.VenteRepository;

@Service
@Transactional(readOnly = true)
public class SuperAdminDashboardService {

    @Autowired
    private PharmacieRepository pharmacieRepository;

    @Autowired
    private PlanTarifaireRepository planTarifaireRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private SuperAdminRepository superAdminRepository;

    @Autowired
    private AbonnementRepository abonnementRepository;

    @Autowired
    private VenteRepository venteRepository;

    public SuperAdminDashboardDTO getSuperAdminDashboard() {
        long totalPharmacies = pharmacieRepository.count();
        long totalPlans = planTarifaireRepository.count();
        long totalUsers = utilisateurRepository.count();
        long totalSuperAdmins = superAdminRepository.count();
        long totalAdmins = utilisateurRepository.countByRole(Role.ADMIN);
        long totalPharmaciens = utilisateurRepository.countByRole(Role.PHARMACIEN);
        long activeSubscriptions = abonnementRepository.countByStatut(StatutAbonnement.ACTIF);
        long systemSalesCount = venteRepository.count();
        Double systemSalesAmount = venteRepository.sumMontantTotal();

        return new SuperAdminDashboardDTO(
            totalPharmacies,
            activeSubscriptions,
            totalPlans,
            totalUsers,
            totalSuperAdmins,
            totalAdmins,
            totalPharmaciens,
            systemSalesCount,
            systemSalesAmount != null ? systemSalesAmount : 0.0
        );
    }
}