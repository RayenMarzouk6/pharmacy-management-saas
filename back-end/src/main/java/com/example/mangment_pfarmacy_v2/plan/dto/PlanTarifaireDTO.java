package com.example.mangment_pfarmacy_v2.plan.dto;

import java.util.List;
import java.util.UUID;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class PlanTarifaireDTO {
    private UUID id;
    
    @NotBlank(message = "Le nom du plan est obligatoire")
    private String nom;
    
    @PositiveOrZero(message = "Le prix doit être positif ou zéro")
    private double prixMensuel;
    
    @Min(value = 1, message = "Le nombre d'utilisateurs doit être au moins 1")
    private Integer maxUtilisateurs;
    
    @NotEmpty(message = "Le plan doit avoir au moins une fonctionnalité")
    private List<String> features;
}
