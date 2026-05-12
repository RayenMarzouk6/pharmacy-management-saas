package com.example.mangment_pfarmacy_v2.pharmacie.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mangment_pfarmacy_v2.pharmacie.dto.PharmacieDTO;
import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;
import com.example.mangment_pfarmacy_v2.pharmacie.repository.PharmacieRepository;
import com.example.mangment_pfarmacy_v2.superadmin.entity.SuperAdmin;
import com.example.mangment_pfarmacy_v2.superadmin.repository.SuperAdminRepository;

@Service
@Transactional
public class PharmacieService {

    @Autowired
    private PharmacieRepository pharmacieRepository;

    @Autowired
    private SuperAdminRepository superAdminRepository;

    public Pharmacie createPharmacie(PharmacieDTO dto, UUID creatorUserId) {
        Pharmacie p = new Pharmacie();
        p.setNom(dto.getNom());
        p.setAdresse(dto.getAdresse());
        p.setTelephone(dto.getTelephone());
        p.setTenantId(java.util.UUID.randomUUID().toString());

        if (creatorUserId != null) {
            Optional<SuperAdmin> sa = superAdminRepository.findById(creatorUserId);
            sa.ifPresent(p::setSuperAdmin);
        }

        return pharmacieRepository.save(p);
    }

    public Optional<Pharmacie> findById(UUID id) {
        return pharmacieRepository.findById(id);
    }

    public List<Pharmacie> findAll() {
        return pharmacieRepository.findAll();
    }

    public Pharmacie updatePharmacie(UUID id, PharmacieDTO dto) {
        Pharmacie p = pharmacieRepository.findById(id).orElseThrow(() -> new RuntimeException("Pharmacie non trouvée"));
        p.setNom(dto.getNom() != null ? dto.getNom() : p.getNom());
        p.setAdresse(dto.getAdresse() != null ? dto.getAdresse() : p.getAdresse());
        p.setTelephone(dto.getTelephone() != null ? dto.getTelephone() : p.getTelephone());
        return pharmacieRepository.save(p);
    }

    public void deletePharmacie(UUID id) {
        pharmacieRepository.deleteById(id);
    }
}
