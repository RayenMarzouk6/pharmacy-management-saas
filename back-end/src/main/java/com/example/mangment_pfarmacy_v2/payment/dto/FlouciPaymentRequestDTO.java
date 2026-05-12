package com.example.mangment_pfarmacy_v2.payment.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FlouciPaymentRequestDTO {

    @NotNull
    private UUID planId;
}