package com.example.mangment_pfarmacy_v2.payment.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mangment_pfarmacy_v2.payment.dto.FlouciPaymentResponseDTO;
import com.example.mangment_pfarmacy_v2.payment.dto.FlouciVerifyResponseDTO;
import com.example.mangment_pfarmacy_v2.payment.service.FlouciPaymentService;

@RestController
@RequestMapping("/api/payments/flouci")
public class FlouciPaymentController {

    @Autowired
    private FlouciPaymentService flouciPaymentService;

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PostMapping("/plans/{planId}")
    public ResponseEntity<FlouciPaymentResponseDTO> createPayment(@PathVariable UUID planId) {
        UUID pharmacieId = com.example.mangment_pfarmacy_v2.common.security.TenantContext.getPharmacieId();
        if (pharmacieId == null) {
            throw new org.springframework.security.access.AccessDeniedException("Pharmacie context not found");
        }
        return ResponseEntity.ok(flouciPaymentService.createPayment(planId, pharmacieId));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @GetMapping("/verify/{paymentId}")
    public ResponseEntity<FlouciVerifyResponseDTO> verifyPayment(@PathVariable String paymentId) {
        return ResponseEntity.ok(flouciPaymentService.verifyPayment(paymentId));
    }
}