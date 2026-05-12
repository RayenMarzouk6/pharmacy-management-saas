package com.example.mangment_pfarmacy_v2.dashboard.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private Double caJour;
    private Double caSemaine;
    private Double caMois;
    private List<TopMedicamentDTO> topMedicaments;
    private List<StockFaibleDTO> stockFaible;
    private List<VenteParPharmacienDTO> ventesByPharmacien;
}
