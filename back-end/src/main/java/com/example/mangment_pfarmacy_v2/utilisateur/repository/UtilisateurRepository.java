package com.example.mangment_pfarmacy_v2.utilisateur.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mangment_pfarmacy_v2.utilisateur.entity.Utilisateur;
import com.example.mangment_pfarmacy_v2.utilisateur.enums.Role;

public interface UtilisateurRepository
        extends JpaRepository<Utilisateur, UUID> {

        Optional<Utilisateur> findByEmail(String email);
        boolean existsByEmail(String email);
        long countByRole(Role role);
 
        List<Utilisateur> findByPharmacieIdAndRole(
        UUID pharId, Role role);
}

