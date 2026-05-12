package com.example.mangment_pfarmacy_v2.payment.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.mangment_pfarmacy_v2.payment.entity.Paiement;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, UUID> {
    Optional<Paiement> findByPaymentId(String paymentId);
}
