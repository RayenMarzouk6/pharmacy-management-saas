package com.example.mangment_pfarmacy_v2.vente;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.example.mangment_pfarmacy_v2.common.security.TenantContext;
import com.example.mangment_pfarmacy_v2.abonnement.entity.Abonnement;
import com.example.mangment_pfarmacy_v2.abonnement.enums.StatutAbonnement;
import com.example.mangment_pfarmacy_v2.abonnement.repository.AbonnementRepository;
import com.example.mangment_pfarmacy_v2.medicament.entity.Medicament;
import com.example.mangment_pfarmacy_v2.medicament.repository.MedicamentRepository;
import com.example.mangment_pfarmacy_v2.plan.entity.PlanTarifaire;
import com.example.mangment_pfarmacy_v2.plan.repository.PlanTarifaireRepository;
import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;
import com.example.mangment_pfarmacy_v2.pharmacie.repository.PharmacieRepository;
import com.example.mangment_pfarmacy_v2.utilisateur.entity.Pharmacien;
import com.example.mangment_pfarmacy_v2.utilisateur.enums.Role;
import com.example.mangment_pfarmacy_v2.utilisateur.repository.UtilisateurRepository;
import com.example.mangment_pfarmacy_v2.vente.dto.LigneVenteDTO;
import com.example.mangment_pfarmacy_v2.vente.dto.VenteCreateDTO;
import com.example.mangment_pfarmacy_v2.vente.dto.VenteDTO;
import com.example.mangment_pfarmacy_v2.vente.service.VenteService;

@SpringBootTest
@ActiveProfiles("test")
public class VenteServiceIntegrationTest {

    @Autowired
    private PharmacieRepository pharmacieRepository;

    @Autowired
    private MedicamentRepository medicamentRepository;

    @Autowired
    private VenteService venteService;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PlanTarifaireRepository planTarifaireRepository;

    @Autowired
    private AbonnementRepository abonnementRepository;

    @AfterEach
    void cleanup() {
        TenantContext.clear();
        SecurityContextHolder.clearContext();
    }

    @Test
    @Transactional
    void testSuccessfulVente_decrementsStock_andCreatesVente() {
        Pharmacie ph = new Pharmacie();
        ph.setNom("TestPharm");
        ph.setAdresse("Rue 1");
        ph.setTenantId("t-1");

        Abonnement abonnement = buildActiveAbonnement("PLAN-TEST-1");
        ph.setAbonnement(abonnement);
        ph = pharmacieRepository.save(ph);

        Medicament med = new Medicament();
        med.setNom("Paracetamol");
        med.setImageUrl("");
        med.setDescription("desc");
        med.setPrix(2.5);
        med.setQuantiteStock(10);
        med.setSeuilAlerte(2);
        med.setDateExpiration(LocalDate.now().plusYears(1));
        med.setPharmacy(ph);
        med = medicamentRepository.save(med);

        Pharmacien pharmacien = new Pharmacien();
        pharmacien.setFirst_name("Ali");
        pharmacien.setLast_name("Saleh");
        pharmacien.setEmail("ali@example.com");
        pharmacien.setPassword("secret");
        pharmacien.setRole(Role.PHARMACIEN);
        pharmacien.setPharmacy(ph);
        utilisateurRepository.save(pharmacien);

        TenantContext.setPharmacieId(ph.getId());
        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken("ali@example.com", "N/A", java.util.List.of()));

        LigneVenteDTO ligne = new LigneVenteDTO();
        ligne.setMedicamentId(med.getId());
        ligne.setQuantite(3);

        VenteCreateDTO dto = new VenteCreateDTO();
        dto.setLignes(java.util.List.of(ligne));

        VenteDTO result = venteService.creerVente(dto);
        assertThat(result).isNotNull();
        assertThat(result.getMontantTotal()).isEqualTo(3 * med.getPrix());

        Medicament updated = medicamentRepository.findById(med.getId()).get();
        assertThat(updated.getQuantiteStock()).isEqualTo(7);
    }

    @Test
    @Transactional
    void testVente_insufficientStock_rollsBack() {
        Pharmacie ph = new Pharmacie();
        ph.setNom("TestPharm2");
        ph.setAdresse("Rue 2");
        ph.setTenantId("t-2");

        Abonnement abonnement = buildActiveAbonnement("PLAN-TEST-2");
        ph.setAbonnement(abonnement);
        ph = pharmacieRepository.save(ph);

        Medicament med = new Medicament();
        med.setNom("Ibuprofen");
        med.setImageUrl("");
        med.setDescription("desc");
        med.setPrix(5.0);
        med.setQuantiteStock(2);
        med.setSeuilAlerte(1);
        med.setDateExpiration(LocalDate.now().plusYears(1));
        med.setPharmacy(ph);
        med = medicamentRepository.save(med);

        Pharmacien pharmacien = new Pharmacien();
        pharmacien.setFirst_name("Sara");
        pharmacien.setLast_name("Ben");
        pharmacien.setEmail("sara@example.com");
        pharmacien.setPassword("secret");
        pharmacien.setRole(Role.PHARMACIEN);
        pharmacien.setPharmacy(ph);
        utilisateurRepository.save(pharmacien);

        TenantContext.setPharmacieId(ph.getId());
        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken("sara@example.com", "N/A", java.util.List.of()));

        LigneVenteDTO ligne = new LigneVenteDTO();
        ligne.setMedicamentId(med.getId());
        ligne.setQuantite(5); // exceed stock

        VenteCreateDTO dto = new VenteCreateDTO();
        dto.setLignes(java.util.List.of(ligne));

        assertThrows(RuntimeException.class, () -> venteService.creerVente(dto));

        Medicament after = medicamentRepository.findById(med.getId()).get();
        // stock should be unchanged due to rollback
        assertThat(after.getQuantiteStock()).isEqualTo(2);
    }

    private Abonnement buildActiveAbonnement(String planName) {
        PlanTarifaire plan = new PlanTarifaire();
        plan.setNom(planName);
        plan.setPrixMensuel(100.0);
        plan.setMaxUtilisateurs(5);
        plan.setFeatures(java.util.List.of("Vente"));
        plan = planTarifaireRepository.save(plan);

        Abonnement abonnement = new Abonnement();
        abonnement.setDateDebut(LocalDate.now().minusDays(1));
        abonnement.setDateFin(LocalDate.now().plusDays(30));
        abonnement.setStatut(StatutAbonnement.ACTIF);
        abonnement.setPlan(plan);
        return abonnementRepository.save(abonnement);
    }
}
