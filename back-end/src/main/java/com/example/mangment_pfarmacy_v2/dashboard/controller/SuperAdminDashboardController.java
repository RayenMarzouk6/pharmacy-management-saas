package com.example.mangment_pfarmacy_v2.dashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mangment_pfarmacy_v2.dashboard.dto.SuperAdminDashboardDTO;
import com.example.mangment_pfarmacy_v2.dashboard.service.SuperAdminDashboardService;

@RestController
@RequestMapping("/api/superadmin/dashboard")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminDashboardController {

    @Autowired
    private SuperAdminDashboardService superAdminDashboardService;

    @GetMapping
    public ResponseEntity<SuperAdminDashboardDTO> getDashboard() {
        return ResponseEntity.ok(superAdminDashboardService.getSuperAdminDashboard());
    }
}