package com.example.mangment_pfarmacy_v2.pharmacie.controller;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mangment_pfarmacy_v2.common.security.JwtTokenProvider;
import com.example.mangment_pfarmacy_v2.pharmacie.dto.PharmacieDTO;
import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;
import com.example.mangment_pfarmacy_v2.pharmacie.service.PharmacieService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pharmacies")
public class PharmacieController {

    @Autowired
    private PharmacieService pharmacieService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping
    public ResponseEntity<Pharmacie> createPharmacie(@Valid @RequestBody PharmacieDTO dto,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        UUID userId = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            userId = jwtTokenProvider.getUserIdFromToken(token);
        }

        Pharmacie created = pharmacieService.createPharmacie(dto, userId);
        return ResponseEntity.created(URI.create("/api/pharmacies/" + created.getId())).body(created);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping
    public List<Pharmacie> list() {
        return pharmacieService.findAll();
    }

    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Pharmacie> get(@PathVariable UUID id) {
        return pharmacieService.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Pharmacie> update(@PathVariable UUID id, @RequestBody PharmacieDTO dto) {
        Pharmacie updated = pharmacieService.updatePharmacie(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        pharmacieService.deletePharmacie(id);
        return ResponseEntity.noContent().build();
    }
}
