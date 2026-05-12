package com.example.mangment_pfarmacy_v2.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdminDashboardDTO {
    private long totalPharmacies;
    private long activeSubscriptions;
    private long totalPlans;
    private long totalUsers;
    private long totalSuperAdmins;
    private long totalAdmins;
    private long totalPharmaciens;
    private long systemSalesCount;
    private Double systemSalesAmount;
}