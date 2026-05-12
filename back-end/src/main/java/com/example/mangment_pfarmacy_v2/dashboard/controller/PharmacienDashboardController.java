package com.example.mangment_pfarmacy_v2.dashboard.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mangment_pfarmacy_v2.common.security.TenantContext;
import com.example.mangment_pfarmacy_v2.dashboard.dto.PharmacienDashboardDTO;
import com.example.mangment_pfarmacy_v2.dashboard.service.DashboardService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/pharmacien/dashboard")
@PreAuthorize("hasRole('PHARMACIEN') or hasRole('ADMIN')")
public class PharmacienDashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<PharmacienDashboardDTO> getDashboard() {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) {
            log.warn("Tentative accès dashboard pharmacien sans pharmacieId");
            throw new AccessDeniedException("Pharmacie non résolue dans le contexte");
        }

        return ResponseEntity.ok(dashboardService.getDashboardStats(pharmacieId));
    }
}