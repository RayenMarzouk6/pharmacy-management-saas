package com.example.mangment_pfarmacy_v2.vente.service;

import java.util.List;
import java.util.stream.Collectors;

import com.example.mangment_pfarmacy_v2.vente.dto.LigneVenteDTO;
import com.example.mangment_pfarmacy_v2.vente.dto.VenteListDTO;
import com.example.mangment_pfarmacy_v2.vente.dto.VenteDTO;
import com.example.mangment_pfarmacy_v2.vente.entity.LigneVente;
import com.example.mangment_pfarmacy_v2.vente.entity.Vente;

public final class VenteMapper {

    private VenteMapper() {
    }

    public static VenteDTO toDTO(Vente vente) {
        VenteDTO dto = new VenteDTO();
        dto.setId(vente.getId());
        dto.setDateVente(vente.getDateVente());
        dto.setMontantTotal(vente.getMontantTotal());
        dto.setStatut(vente.getStatut());
        dto.setLignes(toLigneDTOs(vente.getLignesVente()));
        if (vente.getUtilisateur() != null) {
            dto.setUtilisateurNom(vente.getUtilisateur().getFirst_name() + " " + vente.getUtilisateur().getLast_name());
        }
        return dto;
    }

    public static VenteListDTO toListDTO(Vente vente) {
        VenteListDTO dto = new VenteListDTO();
        dto.setId(vente.getId());
        dto.setCreatedAt(vente.getCreatedAt());
        dto.setDateVente(vente.getDateVente());
        dto.setMontantTotal(vente.getMontantTotal());
        dto.setStatut(vente.getStatut());
        dto.setNombreLignes(vente.getLignesVente() != null ? vente.getLignesVente().size() : 0);
        if (vente.getUtilisateur() != null) {
            dto.setUtilisateurNom(vente.getUtilisateur().getFirst_name() + " " + vente.getUtilisateur().getLast_name());
        }
        return dto;
    }

    private static List<LigneVenteDTO> toLigneDTOs(List<LigneVente> lignes) {
        return lignes.stream().map(ligne -> {
            LigneVenteDTO dto = new LigneVenteDTO();
            dto.setQuantite(ligne.getQuantite());
            dto.setPrixUnitaire(ligne.getPrixUnitaire());
            dto.setVenteId(ligne.getVente() != null ? ligne.getVente().getId() : null);
            dto.setMedicamentId(ligne.getMedicament() != null ? ligne.getMedicament().getId() : null);
            return dto;
        }).collect(Collectors.toList());
    }
}