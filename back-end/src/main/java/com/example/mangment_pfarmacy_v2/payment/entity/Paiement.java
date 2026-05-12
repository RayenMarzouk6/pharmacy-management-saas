package com.example.mangment_pfarmacy_v2.payment.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "paiements")
@Getter
@Setter
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String paymentId; // Flouci Payment ID

    @Column(nullable = false)
    private UUID planId;

    @Column(nullable = false)
    private UUID pharmacieId;

    private double amount;

    @Column(nullable = false)
    private String status; // PENDING, SUCCESS, FAILED

    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt;
}
