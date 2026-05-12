package com.example.mangment_pfarmacy_v2.utilisateur.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;
import com.example.mangment_pfarmacy_v2.pharmacie.repository.PharmacieRepository;
import com.example.mangment_pfarmacy_v2.utilisateur.dto.UtilisateurDTO;
import com.example.mangment_pfarmacy_v2.utilisateur.entity.Pharmacien;
import com.example.mangment_pfarmacy_v2.utilisateur.enums.Role;
import com.example.mangment_pfarmacy_v2.utilisateur.repository.UtilisateurRepository;

@Service
@Transactional
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PharmacieRepository pharmacieRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Pharmacien createPharmacien(UtilisateurDTO dto, UUID currentPharmacieId) {
        UUID targetPharmacieId = dto.getPharmacieId() != null ? dto.getPharmacieId() : currentPharmacieId;
        Pharmacie pharmacie = pharmacieRepository.findById(targetPharmacieId)
                .orElseThrow(() -> new RuntimeException("Pharmacie non trouvée"));

        Pharmacien p = new Pharmacien();
        p.setFirst_name(dto.getFirstName());
        p.setLast_name(dto.getLastName());
        p.setEmail(dto.getEmail());
        p.setPassword(passwordEncoder.encode(dto.getPassword()));
        p.setRole(Role.PHARMACIEN);
        p.setPharmacy(pharmacie);
        p.setMatricule(dto.getMatricule());
        p.setSpecialite(dto.getSpecialite());

        return (Pharmacien) utilisateurRepository.save(p);
    }

    public List<com.example.mangment_pfarmacy_v2.utilisateur.entity.Utilisateur> listPharmaciensByPharmacie(UUID pharmacieId) {
        return utilisateurRepository.findByPharmacieIdAndRole(pharmacieId, Role.PHARMACIEN).stream().toList();
    }

    public com.example.mangment_pfarmacy_v2.utilisateur.entity.Utilisateur findById(UUID id) {
        return utilisateurRepository.findById(id).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public void deleteUtilisateur(UUID id) {
        utilisateurRepository.deleteById(id);
    }

    public Pharmacien updatePharmacien(UUID id, UtilisateurDTO dto, UUID currentPharmacieId) {
        com.example.mangment_pfarmacy_v2.utilisateur.entity.Utilisateur u = findById(id);
        if (!(u instanceof Pharmacien)) {
            throw new RuntimeException("Utilisateur n'est pas un pharmacien");
        }

        Pharmacien p = (Pharmacien) u;

        // Vérifier appartenance à la même pharmacie
        if (!p.getPharmacy().getId().equals(currentPharmacieId)) {
            throw new RuntimeException("Accès refusé");
        }

        if (dto.getFirstName() != null) p.setFirst_name(dto.getFirstName());
        if (dto.getLastName() != null) p.setLast_name(dto.getLastName());
        if (dto.getEmail() != null) p.setEmail(dto.getEmail());
        if (dto.getPassword() != null) p.setPassword(passwordEncoder.encode(dto.getPassword()));
        if (dto.getMatricule() != null) p.setMatricule(dto.getMatricule());
        if (dto.getSpecialite() != null) p.setSpecialite(dto.getSpecialite());

        return (Pharmacien) utilisateurRepository.save(p);
    }
}
