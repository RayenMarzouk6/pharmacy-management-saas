package com.example.mangment_pfarmacy_v2.fournisseur.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mangment_pfarmacy_v2.fournisseur.dto.FournisseurDTO;
import com.example.mangment_pfarmacy_v2.fournisseur.entity.Fournisseur;
import com.example.mangment_pfarmacy_v2.fournisseur.repository.FournisseurRepository;
import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;
import com.example.mangment_pfarmacy_v2.pharmacie.repository.PharmacieRepository;

@Service
@Transactional
public class FournisseurService {

    @Autowired
    private FournisseurRepository fournisseurRepository;

    @Autowired
    private PharmacieRepository pharmacieRepository;

    public Fournisseur createFournisseur(FournisseurDTO dto, UUID pharmacieId) {
        Pharmacie pharmacie = pharmacieRepository.findById(pharmacieId)
                .orElseThrow(() -> new RuntimeException("Pharmacie non trouvée"));

        Fournisseur f = new Fournisseur();
        f.setNom(dto.getNom());
        f.setTelephone(dto.getTelephone());
        f.setEmail(dto.getEmail());
        f.setAdresse(dto.getAdresse());
        f.setPharmacy(pharmacie);

        return fournisseurRepository.save(f);
    }

    public Page<Fournisseur> listFournisseurs(UUID pharmacieId, Pageable pageable) {
        return fournisseurRepository.findByPharmacieId(pharmacieId, pageable);
    }

    public Page<Fournisseur> searchByNom(String nom, UUID pharmacieId, Pageable pageable) {
        return fournisseurRepository.findByNomContainingIgnoreCaseAndPharmacieId(nom, pharmacieId, pageable);
    }

    public Optional<Fournisseur> findById(UUID id, UUID pharmacieId) {
        return fournisseurRepository.findByIdAndPharmacieId(id, pharmacieId);
    }

    public Fournisseur updateFournisseur(UUID id, FournisseurDTO dto, UUID pharmacieId) {
        Fournisseur f = fournisseurRepository.findByIdAndPharmacieId(id, pharmacieId)
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));

        if (dto.getNom() != null) f.setNom(dto.getNom());
        if (dto.getTelephone() != null) f.setTelephone(dto.getTelephone());
        if (dto.getEmail() != null) f.setEmail(dto.getEmail());
        if (dto.getAdresse() != null) f.setAdresse(dto.getAdresse());

        return fournisseurRepository.save(f);
    }

    public void deleteFournisseur(UUID id, UUID pharmacieId) {
        Fournisseur f = fournisseurRepository.findByIdAndPharmacieId(id, pharmacieId)
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));
        fournisseurRepository.delete(f);
    }
}
