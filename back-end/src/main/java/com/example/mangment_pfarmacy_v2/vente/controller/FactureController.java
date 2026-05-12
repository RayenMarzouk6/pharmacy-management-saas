package com.example.mangment_pfarmacy_v2.vente.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.example.mangment_pfarmacy_v2.common.security.TenantContext;
import com.example.mangment_pfarmacy_v2.vente.service.FactureService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/ventes")
@PreAuthorize("isAuthenticated()")
public class FactureController {

    @Autowired
    private FactureService factureService;

    @PreAuthorize("hasRole('PHARMACIEN') or hasRole('ADMIN')")
    @GetMapping("/{id}/facture")
    public ResponseEntity<StreamingResponseBody> generateFacturePDF(@PathVariable UUID id) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) {
            log.warn("Tentative téléchargement facture sans pharmacieId");
            throw new AccessDeniedException("Pharmacie non résolue dans le contexte");
        }

        byte[] pdfContent = factureService.generateFacturePDF(id, pharmacieId);
        StreamingResponseBody stream = outputStream -> outputStream.write(pdfContent);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=facture_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(stream);
    }
}
