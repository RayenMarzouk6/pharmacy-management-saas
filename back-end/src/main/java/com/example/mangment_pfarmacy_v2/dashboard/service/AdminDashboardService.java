package com.example.mangment_pfarmacy_v2.dashboard.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mangment_pfarmacy_v2.abonnement.enums.StatutAbonnement;
import com.example.mangment_pfarmacy_v2.abonnement.repository.AbonnementRepository;
import com.example.mangment_pfarmacy_v2.dashboard.dto.AdminDashboardDTO;
import com.example.mangment_pfarmacy_v2.dashboard.dto.PharmacySalesSummaryDTO;
import com.example.mangment_pfarmacy_v2.pharmacie.repository.PharmacieRepository;
import com.example.mangment_pfarmacy_v2.plan.repository.PlanTarifaireRepository;
import com.example.mangment_pfarmacy_v2.utilisateur.enums.Role;
import com.example.mangment_pfarmacy_v2.utilisateur.repository.UtilisateurRepository;
import com.example.mangment_pfarmacy_v2.vente.repository.VenteRepository;

@Service
@Transactional(readOnly = true)
public class AdminDashboardService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PharmacieRepository pharmacieRepository;

    @Autowired
    private PlanTarifaireRepository planTarifaireRepository;

    @Autowired
    private AbonnementRepository abonnementRepository;

    @Autowired
    private VenteRepository venteRepository;

    public AdminDashboardDTO getAdminDashboard() {
        long totalUsers = utilisateurRepository.count();
        long totalAdmins = utilisateurRepository.countByRole(Role.ADMIN);
        long totalPharmaciens = utilisateurRepository.countByRole(Role.PHARMACIEN);
        long totalPharmacies = pharmacieRepository.count();
        long totalPlans = planTarifaireRepository.count();
        long totalSubscriptions = abonnementRepository.count();
        long activeSubscriptions = abonnementRepository.countByStatut(StatutAbonnement.ACTIF);
        long expiredSubscriptions = abonnementRepository.countByStatut(StatutAbonnement.EXPIRE);
        long suspendedSubscriptions = abonnementRepository.countByStatut(StatutAbonnement.SUSPENDU);
        long totalSalesCount = venteRepository.count();
        Double totalSalesAmount = venteRepository.sumMontantTotal();

        List<PharmacySalesSummaryDTO> topPharmaciesBySales = new ArrayList<>();
        List<Object[]> rows = venteRepository.salesByPharmacie();
        for (Object[] row : rows) {
            if (row == null || row.length < 4) {
                continue;
            }

            PharmacySalesSummaryDTO dto = new PharmacySalesSummaryDTO(
                row[0] != null ? (java.util.UUID) row[0] : null,
                row[1] != null ? row[1].toString() : "N/A",
                row[2] != null ? ((Number) row[2]).longValue() : 0L,
                row[3] != null ? ((Number) row[3]).doubleValue() : 0.0
            );
            topPharmaciesBySales.add(dto);
        }

        if (topPharmaciesBySales.size() > 10) {
            topPharmaciesBySales = topPharmaciesBySales.subList(0, 10);
        }

        return new AdminDashboardDTO(
            totalUsers,
            totalAdmins,
            totalPharmaciens,
            totalPharmacies,
            totalPlans,
            totalSubscriptions,
            activeSubscriptions,
            expiredSubscriptions,
            suspendedSubscriptions,
            totalSalesCount,
            totalSalesAmount != null ? totalSalesAmount : 0.0,
            topPharmaciesBySales
        );
    }
}