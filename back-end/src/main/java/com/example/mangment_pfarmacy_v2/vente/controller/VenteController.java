package com.example.mangment_pfarmacy_v2.vente.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mangment_pfarmacy_v2.common.security.TenantContext;
import com.example.mangment_pfarmacy_v2.vente.dto.VenteCreateDTO;
import com.example.mangment_pfarmacy_v2.vente.dto.VenteDTO;
import com.example.mangment_pfarmacy_v2.vente.dto.VenteListDTO;
import com.example.mangment_pfarmacy_v2.vente.dto.VenteUpdateDTO;
import com.example.mangment_pfarmacy_v2.vente.entity.Vente;
import com.example.mangment_pfarmacy_v2.vente.service.VenteService;
import com.example.mangment_pfarmacy_v2.vente.service.VenteMapper;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/ventes")
@PreAuthorize("isAuthenticated()")
public class VenteController {

    @Autowired
    private VenteService venteService;

    @PreAuthorize("hasRole('PHARMACIEN') or hasRole('ADMIN')")

    @PostMapping
    public ResponseEntity<VenteDTO> createVente(@Valid @RequestBody VenteCreateDTO dto) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) {
            log.warn("Tentative création vente sans pharmacieId");
            throw new AccessDeniedException("Pharmacie non résolue dans le contexte");
        }

        VenteDTO created = venteService.creerVente(dto);
        return ResponseEntity.ok(created);
    }

    @PreAuthorize("hasRole('PHARMACIEN') or hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<VenteListDTO>> listVentes(Pageable pageable) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) throw new AccessDeniedException("Pharmacie non résolue dans le contexte");

        Page<VenteListDTO> ventes = venteService.listVentesByPharmacy(pharmacieId, pageable);
        return ResponseEntity.ok(ventes);
    }

    @PreAuthorize("hasRole('PHARMACIEN') or hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<VenteDTO> getVente(@PathVariable UUID id) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) throw new AccessDeniedException("Pharmacie non résolue dans le contexte");

        return venteService.findById(id, pharmacieId)
                .map(VenteMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('PHARMACIEN') or hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<VenteDTO> updateVente(@PathVariable UUID id, @RequestBody VenteUpdateDTO dto) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) throw new AccessDeniedException("Pharmacie non résolue dans le contexte");

        try {
            VenteDTO updated = venteService.updateVente(id, pharmacieId, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('PHARMACIEN') or hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVente(@PathVariable UUID id) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) throw new AccessDeniedException("Pharmacie non résolue dans le contexte");

        try {
            venteService.deleteVente(id, pharmacieId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
