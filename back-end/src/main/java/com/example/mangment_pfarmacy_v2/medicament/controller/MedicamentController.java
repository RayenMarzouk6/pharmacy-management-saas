package com.example.mangment_pfarmacy_v2.medicament.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mangment_pfarmacy_v2.common.security.TenantContext;
import com.example.mangment_pfarmacy_v2.medicament.dto.MedicamentDTO;
import com.example.mangment_pfarmacy_v2.medicament.entity.Medicament;
import com.example.mangment_pfarmacy_v2.medicament.service.MedicamentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/medicaments")
@PreAuthorize("isAuthenticated()")
public class MedicamentController {

    @Autowired
    private MedicamentService medicamentService;

    @PostMapping
    public ResponseEntity<Medicament> create(@Valid @RequestBody MedicamentDTO dto) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) return ResponseEntity.status(403).build();
        
        Medicament created = medicamentService.createMedicament(dto, pharmacieId);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<Page<Medicament>> list(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) return ResponseEntity.status(403).build();

        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(medicamentService.searchByNom(search, pharmacieId, pageable));
        } else {
            return ResponseEntity.ok(medicamentService.listMedicaments(pharmacieId, pageable));
        }
    }

    // @GetMapping("/get-by-date")
    // public ResponseEntity<List<Medicament>> getByDate(@RequestParam String date){
    //     String date_input = date;
    //     return ResponseEntity.ok();

    // }

    @GetMapping("/{id}")
    public ResponseEntity<Medicament> get(@PathVariable UUID id) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) return ResponseEntity.status(403).build();

        return medicamentService.findById(id, pharmacieId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicament> update(@PathVariable UUID id, @RequestBody MedicamentDTO dto) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) return ResponseEntity.status(403).build();

        try {
            Medicament updated = medicamentService.updateMedicament(id, dto, pharmacieId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) return ResponseEntity.status(403).build();

        try {
            medicamentService.deleteMedicament(id, pharmacieId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/stock-faible")
    public ResponseEntity<List<Medicament>> getStockFaible() {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) return ResponseEntity.status(403).build();

        List<Medicament> medicaments = medicamentService.findStockFaible(pharmacieId);
        return ResponseEntity.ok(medicaments);
    }

    @GetMapping("/expires")
    public ResponseEntity<List<Medicament>> getExpiringMedicaments(
            @RequestParam(defaultValue = "30") int daysFromNow) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) return ResponseEntity.status(403).build();

        List<Medicament> medicaments = medicamentService.findExpiringMedicaments(pharmacieId, daysFromNow);
        return ResponseEntity.ok(medicaments);
    }
}
