package com.example.mangment_pfarmacy_v2.payment.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.mangment_pfarmacy_v2.payment.dto.FlouciPaymentResponseDTO;
import com.example.mangment_pfarmacy_v2.payment.dto.FlouciVerifyResponseDTO;
import com.example.mangment_pfarmacy_v2.plan.entity.PlanTarifaire;
import com.example.mangment_pfarmacy_v2.plan.repository.PlanTarifaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.mangment_pfarmacy_v2.payment.entity.Paiement;
import com.example.mangment_pfarmacy_v2.payment.repository.PaiementRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Slf4j
@Service
public class FlouciPaymentService {

    private static final String GENERATE_PAYMENT_URL = "https://developers.flouci.com/api/generate_payment";
    private static final String VERIFY_PAYMENT_URL = "https://developers.flouci.com/api/verify_payment/";

    private final PlanTarifaireRepository planRepository;
    private final PaiementRepository paiementRepository;
    private final com.example.mangment_pfarmacy_v2.abonnement.service.AbonnementService abonnementService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate;

    @Value("${flouci.app-token}")
    private String appToken;

    @Value("${flouci.app-secret:${SECRET_FLOUCI_TOKEN:}}")
    private String appSecret;

    @Value("${flouci.success-link}")
    private String successLink;

    @Value("${flouci.fail-link}")
    private String failLink;

    @Value("${flouci.developer-tracking-id}")
    private String developerTrackingId;

    @Value("${flouci.accept-card:true}")
    private String acceptCard;

    @Value("${flouci.session-timeout-secs:1200}")
    private Integer sessionTimeoutSecs;

    @Autowired
    public FlouciPaymentService(PlanTarifaireRepository planRepository, 
                               PaiementRepository paiementRepository,
                               com.example.mangment_pfarmacy_v2.abonnement.service.AbonnementService abonnementService) {
        this.planRepository = planRepository;
        this.paiementRepository = paiementRepository;
        this.abonnementService = abonnementService;
        this.restTemplate = new RestTemplate();
    }

    public FlouciPaymentResponseDTO createPayment(UUID planId, UUID pharmacieId) {
        PlanTarifaire plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        double amount = BigDecimal.valueOf(plan.getPrixMensuel())
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();

        Map<String, Object> payload = new HashMap<>();
        payload.put("app_token", appToken);
        payload.put("app_secret", appSecret);
        payload.put("amount", (long)(amount * 1000)); // Flouci expects millimes as integer
        payload.put("accept_card", acceptCard);
        payload.put("session_timeout_secs", sessionTimeoutSecs);
        payload.put("success_link", successLink);
        payload.put("fail_link", failLink);
        payload.put("developer_tracking_id", developerTrackingId);

        log.info("Initiating Flouci payment for plan {} and pharmacy {}. Amount: {} millimes", plan.getNom(), pharmacieId, (long)(amount * 1000));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    GENERATE_PAYMENT_URL,
                    new HttpEntity<>(payload, headers),
                    String.class);

            log.info("Flouci response status: {}", response.getStatusCode());
            JsonNode rawResponse = parseJson(response.getBody());
            log.info("Flouci response body: {}", rawResponse);

            String flouciPaymentId = extractText(rawResponse, "result", "payment_id");
            String flouciPaymentUrl = extractText(rawResponse, "result", "link");

            if (flouciPaymentId == null || flouciPaymentUrl == null) {
                log.error("Failed to extract payment info from Flouci response: {}", rawResponse);
                throw new RuntimeException("Erreur Flouci: " + extractText(rawResponse, "message"));
            }

            // Store pending payment
            Paiement paiement = new Paiement();
            paiement.setPaymentId(flouciPaymentId);
            paiement.setPlanId(planId);
            paiement.setPharmacieId(pharmacieId);
            paiement.setAmount(amount);
            paiement.setStatus("PENDING");
            paiementRepository.save(paiement);

            FlouciPaymentResponseDTO result = new FlouciPaymentResponseDTO();
            result.setPlanId(plan.getId());
            result.setPlanName(plan.getNom());
            result.setAmount(amount);
            result.setRawResponse(rawResponse);
            result.setPaymentId(flouciPaymentId);
            result.setPaymentUrl(flouciPaymentUrl);
            return result;
        } catch (Exception e) {
            log.error("Error creating Flouci payment", e);
            throw new RuntimeException("Erreur lors de l'initiation du paiement: " + e.getMessage());
        }
    }

    @org.springframework.transaction.annotation.Transactional
    public FlouciVerifyResponseDTO verifyPayment(String paymentId) {
        log.info("Verifying Flouci payment ID: {}", paymentId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apppublic", appToken);
        headers.set("appsecret", appSecret);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                VERIFY_PAYMENT_URL + paymentId,
                org.springframework.http.HttpMethod.GET,
                new HttpEntity<>(headers),
                String.class);

            JsonNode rawResponse = parseJson(response.getBody());
            log.info("Flouci verification response: {}", rawResponse);
            
            boolean isSuccess = response.getStatusCode().is2xxSuccessful() && 
                               "SUCCESS".equals(extractText(rawResponse, "result", "status"));

            if (isSuccess) {
                Paiement paiement = paiementRepository.findByPaymentId(paymentId)
                        .orElseThrow(() -> new RuntimeException("Transaction not found for ID: " + paymentId));
                
                if (!"SUCCESS".equals(paiement.getStatus())) {
                    paiement.setStatus("SUCCESS");
                    paiement.setUpdatedAt(java.time.LocalDateTime.now());
                    paiementRepository.save(paiement);

                    // Activate Subscription
                    com.example.mangment_pfarmacy_v2.abonnement.dto.AbonnementDTO subDto = new com.example.mangment_pfarmacy_v2.abonnement.dto.AbonnementDTO();
                    subDto.setPlanId(paiement.getPlanId());
                    subDto.setPharmacieId(paiement.getPharmacieId());
                    subDto.setDateDebut(java.time.LocalDate.now());
                    subDto.setDateFin(java.time.LocalDate.now().plusYears(1));
                    subDto.setStatut(com.example.mangment_pfarmacy_v2.abonnement.enums.StatutAbonnement.ACTIF);
                    
                    abonnementService.createAbonnement(subDto);
                    log.info("Subscription activated for pharmacy {} and plan {}", paiement.getPharmacieId(), paiement.getPlanId());
                }
            }

            FlouciVerifyResponseDTO result = new FlouciVerifyResponseDTO();
            result.setRawResponse(rawResponse);
            result.setVerified(isSuccess);
            return result;
        } catch (Exception e) {
            log.error("Error verifying Flouci payment", e);
            throw new RuntimeException("Erreur lors de la vérification du paiement: " + e.getMessage());
        }
    }

    private JsonNode parseJson(String body) {
        try {
            return body == null || body.isBlank() ? objectMapper.createObjectNode() : objectMapper.readTree(body);
        } catch (Exception ex) {
            return objectMapper.createObjectNode();
        }
    }

    private String extractText(JsonNode node, String... paths) {
        JsonNode current = node;
        for (String path : paths) {
            if (current == null || current.isMissingNode()) {
                return null;
            }
            current = current.get(path);
        }

        if (current == null || current.isNull() || current.isMissingNode()) {
            return null;
        }
        return current.isTextual() ? current.asText() : current.toString();
    }
}