package com.example.mangment_pfarmacy_v2.dashboard.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDTO {
    private long totalUsers;
    private long totalAdmins;
    private long totalPharmaciens;
    private long totalPharmacies;
    private long totalPlans;
    private long totalSubscriptions;
    private long activeSubscriptions;
    private long expiredSubscriptions;
    private long suspendedSubscriptions;
    private long totalSalesCount;
    private Double totalSalesAmount;
    private List<PharmacySalesSummaryDTO> topPharmaciesBySales;
}