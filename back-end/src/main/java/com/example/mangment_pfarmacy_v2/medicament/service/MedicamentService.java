package com.example.mangment_pfarmacy_v2.medicament.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mangment_pfarmacy_v2.fournisseur.entity.Fournisseur;
import com.example.mangment_pfarmacy_v2.fournisseur.repository.FournisseurRepository;
import com.example.mangment_pfarmacy_v2.medicament.dto.MedicamentDTO;
import com.example.mangment_pfarmacy_v2.medicament.entity.Medicament;
import com.example.mangment_pfarmacy_v2.medicament.repository.MedicamentRepository;
import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;
import com.example.mangment_pfarmacy_v2.pharmacie.repository.PharmacieRepository;

@Service
@Transactional
public class MedicamentService {

    @Autowired
    private MedicamentRepository medicamentRepository;

    @Autowired
    private PharmacieRepository pharmacieRepository;

    @Autowired
    private FournisseurRepository fournisseurRepository;

    public Medicament createMedicament(MedicamentDTO dto, UUID pharmacieId) {
        Pharmacie pharmacie = pharmacieRepository.findById(pharmacieId)
                .orElseThrow(() -> new RuntimeException("Pharmacie non trouvée"));

        Medicament m = new Medicament();
        m.setNom(dto.getNom());
        m.setImageUrl(dto.getImageUrl());
        m.setDescription(dto.getDescription());
        m.setPrix(dto.getPrix());
        m.setQuantiteStock(dto.getQuantiteStock());
        m.setSeuilAlerte(dto.getSeuilAlerte());
        m.setDateExpiration(dto.getDateExpiration());
        m.setCodeBarres(dto.getCodeBarres());
        m.setPharmacy(pharmacie);

        if (dto.getFournisseurId() != null) {
            Optional<Fournisseur> f = fournisseurRepository.findById(dto.getFournisseurId());
            f.ifPresent(m::setFournisseur);
        }

        return medicamentRepository.save(m);
    }

    public Page<Medicament> searchByNom(String nom, UUID pharmacieId, Pageable pageable) {
        // Using custom query method from repository
        return medicamentRepository.findByNomContainingIgnoreCaseAndPharmacieId(nom, pharmacieId, pageable);
    }

    public Page<Medicament> listMedicaments(UUID pharmacieId, Pageable pageable) {
        return medicamentRepository.findByPharmacieId(pharmacieId, pageable);
    }

    public Optional<Medicament> findById(UUID id, UUID pharmacieId) {
        return medicamentRepository.findByIdAndPharmacieId(id, pharmacieId);
    }

    public Medicament updateMedicament(UUID id, MedicamentDTO dto, UUID pharmacieId) {
        Medicament m = medicamentRepository.findByIdAndPharmacieId(id, pharmacieId)
                .orElseThrow(() -> new RuntimeException("Médicament non trouvé"));

        if (dto.getNom() != null) m.setNom(dto.getNom());
        if (dto.getImageUrl() != null) m.setImageUrl(dto.getImageUrl());
        if (dto.getDescription() != null) m.setDescription(dto.getDescription());
        if (dto.getPrix() != null) m.setPrix(dto.getPrix());
        if (dto.getQuantiteStock() != null) m.setQuantiteStock(dto.getQuantiteStock());
        if (dto.getSeuilAlerte() != null) m.setSeuilAlerte(dto.getSeuilAlerte());
        if (dto.getDateExpiration() != null) m.setDateExpiration(dto.getDateExpiration());
        if (dto.getCodeBarres() != null) m.setCodeBarres(dto.getCodeBarres());

        if (dto.getFournisseurId() != null) {
            Optional<Fournisseur> f = fournisseurRepository.findById(dto.getFournisseurId());
            f.ifPresent(m::setFournisseur);
        }

        return medicamentRepository.save(m);
    }

    public void deleteMedicament(UUID id, UUID pharmacieId) {
        Medicament m = medicamentRepository.findByIdAndPharmacieId(id, pharmacieId)
                .orElseThrow(() -> new RuntimeException("Médicament non trouvé"));
        medicamentRepository.delete(m);
    }

    public List<Medicament> findStockFaible(UUID pharmacieId) {
        return medicamentRepository.findStockFaible(pharmacieId);
    }

    public List<Medicament> findExpiringMedicaments(UUID pharmacieId, int daysFromNow) {
        LocalDate threshold = LocalDate.now().plusDays(daysFromNow);
        return medicamentRepository.findByDateExpirationBeforeAndPharmacieId(threshold, pharmacieId);
    }
}
