package com.example.mangment_pfarmacy_v2.dashboard.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mangment_pfarmacy_v2.dashboard.dto.DashboardDTO;
import com.example.mangment_pfarmacy_v2.dashboard.dto.PharmacienDashboardDTO;
import com.example.mangment_pfarmacy_v2.dashboard.dto.StockFaibleDTO;
import com.example.mangment_pfarmacy_v2.dashboard.dto.TopMedicamentDTO;
import com.example.mangment_pfarmacy_v2.dashboard.dto.VenteParPharmacienDTO;
import com.example.mangment_pfarmacy_v2.medicament.entity.Medicament;
import com.example.mangment_pfarmacy_v2.medicament.repository.MedicamentRepository;
import com.example.mangment_pfarmacy_v2.vente.entity.Vente;
import com.example.mangment_pfarmacy_v2.vente.repository.VenteRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional(readOnly = true)
public class DashboardService {

    @Autowired
    private VenteRepository venteRepository;

    @Autowired
    private MedicamentRepository medicamentRepository;

    public PharmacienDashboardDTO getDashboardStats(UUID pharmacieId) {
        LocalDate today = LocalDate.now();
        LocalDateTime dayStart = today.atStartOfDay();
        LocalDateTime dayEnd = today.atTime(LocalTime.MAX);
        
        // CA du jour (00:00 à 23:59)
        Double caJour = venteRepository.chiffreAffairesJour(pharmacieId, dayStart, dayEnd);
        if (caJour == null) caJour = 0.0;

        // CA de la semaine (lundi à dimanche)
        LocalDate startOfWeek = today.minusDays(today.getDayOfWeek().getValue() - 1);
        LocalDateTime weekStart = startOfWeek.atStartOfDay();
        LocalDateTime weekEnd = today.atTime(LocalTime.MAX);
        Double caSemaine = calculateCABetweenDates(pharmacieId, weekStart, weekEnd);

        // CA du mois
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDateTime monthStart = startOfMonth.atStartOfDay();
        LocalDateTime monthEnd = today.atTime(LocalTime.MAX);
        Double caMois = calculateCABetweenDates(pharmacieId, monthStart, monthEnd);

        // Top 5 médicaments vendus ce mois
        List<Object[]> topMeds = venteRepository.topMedicamentsByPeriod(pharmacieId, monthStart);
        List<TopMedicamentDTO> topMedicaments = new ArrayList<>();
        if (topMeds != null && !topMeds.isEmpty()) {
            for (Object[] row : topMeds) {
                String nom = (String) row[1];
                Long qty = ((Number) row[2]).longValue();
                TopMedicamentDTO dto = new TopMedicamentDTO();
                dto.setMedicamentNom(nom);
                dto.setQuantiteVendue(qty);
                topMedicaments.add(dto);
            }
        }

        // Ventes par pharmacien sur le mois en cours
        List<Object[]> ventesParPharmacienRows = venteRepository.ventesByPharmacienBetween(pharmacieId, monthStart, monthEnd);
        List<VenteParPharmacienDTO> ventesParPharmacien = new ArrayList<>();
        for (Object[] row : ventesParPharmacienRows) {
            String nom = row[0] != null ? row[0].toString().trim() : "N/A";
            Double montantTotal = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
            Integer nombreVentes = row[2] != null ? ((Number) row[2]).intValue() : 0;
            ventesParPharmacien.add(new VenteParPharmacienDTO(nom, montantTotal, nombreVentes));
        }

        // Stock faible
        List<Medicament> stockFaible = medicamentRepository.findStockFaible(pharmacieId);
        List<StockFaibleDTO> stockList = new ArrayList<>();
        for (Medicament med : stockFaible) {
            StockFaibleDTO dto = new StockFaibleDTO();
            dto.setNom(med.getNom());
            dto.setQuantiteStock(med.getQuantiteStock());
            dto.setSeuilAlerte(med.getSeuilAlerte());
            stockList.add(dto);
        }

        PharmacienDashboardDTO dashboardDTO = new PharmacienDashboardDTO();
        dashboardDTO.setCaJour(caJour);
        dashboardDTO.setCaSemaine(caSemaine);
        dashboardDTO.setCaMois(caMois);
        dashboardDTO.setTopMedicaments(topMedicaments.size() > 5 ? topMedicaments.subList(0, 5) : topMedicaments);
        dashboardDTO.setStockFaible(stockList);
        dashboardDTO.setVentesByPharmacien(ventesParPharmacien);
        return dashboardDTO;
    }

    private Double calculateCABetweenDates(UUID pharmacieId, LocalDateTime start, LocalDateTime end) {
        List<Vente> ventes = venteRepository.findByPeriode(pharmacieId, start, end);
        return ventes.stream()
                .mapToDouble(v -> v.getMontantTotal() != null ? v.getMontantTotal() : 0.0)
                .sum();
    }
}
