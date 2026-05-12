package com.example.mangment_pfarmacy_v2.vente.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mangment_pfarmacy_v2.common.exception.AbonnementExpireException;
import com.example.mangment_pfarmacy_v2.common.exception.ResourceNotFoundException;
import com.example.mangment_pfarmacy_v2.common.exception.StockInsuffisantException;
import com.example.mangment_pfarmacy_v2.common.security.TenantContext;
import com.example.mangment_pfarmacy_v2.medicament.entity.Medicament;
import com.example.mangment_pfarmacy_v2.medicament.repository.MedicamentRepository;
import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;
import com.example.mangment_pfarmacy_v2.pharmacie.repository.PharmacieRepository;
import com.example.mangment_pfarmacy_v2.utilisateur.entity.Utilisateur;
import com.example.mangment_pfarmacy_v2.utilisateur.enums.Role;
import com.example.mangment_pfarmacy_v2.utilisateur.repository.UtilisateurRepository;
import com.example.mangment_pfarmacy_v2.vente.dto.LigneVenteDTO;
import com.example.mangment_pfarmacy_v2.vente.dto.VenteCreateDTO;
import com.example.mangment_pfarmacy_v2.vente.dto.VenteDTO;
import com.example.mangment_pfarmacy_v2.vente.dto.VenteListDTO;
import com.example.mangment_pfarmacy_v2.vente.dto.VenteUpdateDTO;
import com.example.mangment_pfarmacy_v2.vente.entity.LigneVente;
import com.example.mangment_pfarmacy_v2.vente.entity.Vente;
import com.example.mangment_pfarmacy_v2.vente.enums.StatutVente;
import com.example.mangment_pfarmacy_v2.vente.repository.VenteRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class VenteService {
 
    @Autowired
    private VenteRepository venteRepository;
    
    @Autowired
    private MedicamentRepository medicamentRepository;

    @Autowired
    private PharmacieRepository pharmacieRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;
 
    /**
     * Crée une vente avec transaction ACID.
     * Rollback automatique si stock insuffisant.
     */
    public VenteDTO creerVente(VenteCreateDTO dto) {
        UUID pharId = TenantContext.getPharmacieId();
        if (pharId == null) {
            throw new IllegalArgumentException("Pharmacie ID manquante");
        }

        if (dto.getLignes() == null || dto.getLignes().isEmpty()) {
            throw new IllegalArgumentException("La vente doit contenir au moins une ligne");
        }

        Pharmacie pharmacie = pharmacieRepository.findById(pharId)
                .orElseThrow(() -> new ResourceNotFoundException("Pharmacie introuvable"));
        if (!pharmacie.isAbonnementActif()) {
            throw new AbonnementExpireException("Abonnement expiré pour cette pharmacie");
        }

        Utilisateur utilisateur = resolveCurrentPharmacien(pharId);
        
        Vente vente = new Vente();
        vente.setPharmacie(pharmacie);
        vente.setUtilisateur(utilisateur);
        vente.setDateVente(java.time.LocalDateTime.now());
        vente.setStatut(StatutVente.EN_COURS);
 
        double total = 0.0;
        for (LigneVenteDTO ligne : dto.getLignes()) {
            Medicament med = medicamentRepository
                .findByIdAndPharmacieId(ligne.getMedicamentId(), pharId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Médicament introuvable: " + ligne.getMedicamentId()));
 
            // Vérification stock — lève exception pour rollback
            if (med.getQuantiteStock() < ligne.getQuantite()) {
                log.warn("Stock insuffisant pour {}: disponible={}, demandé={}",
                    med.getNom(), med.getQuantiteStock(), ligne.getQuantite());
                throw new StockInsuffisantException(
                    "Stock insuffisant pour : " + med.getNom() 
                    + " (disponible: " + med.getQuantiteStock() + ")");
            }
 
            // Décrémente le stock (atomique dans la transaction)
            med.setQuantiteStock(med.getQuantiteStock() - ligne.getQuantite());
            medicamentRepository.save(med);
 
            // Crée la ligne de vente (snapshot du prix)
            LigneVente ligneVente = new LigneVente();
            ligneVente.setMedicament(med);
            ligneVente.setQuantite(ligne.getQuantite());
            ligneVente.setPrixUnitaire(med.getPrix());
            ligneVente.setVente(vente);
            vente.getLignesVente().add(ligneVente);
 
            total += ligneVente.sousTotal();
        }
 
        vente.setMontantTotal(total);
        vente.setStatut(StatutVente.VALIDEE);
        
        Vente saved = venteRepository.save(vente);
        log.info("Vente créée: {} (montant={}, lignes={})", 
            saved.getId(), total, dto.getLignes().size());
        
        return VenteMapper.toDTO(saved);
    }

    private Utilisateur resolveCurrentPharmacien(UUID pharmacieId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new IllegalArgumentException("Utilisateur authentifié introuvable");
        }

        Utilisateur utilisateur = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        if (utilisateur.getRole() != Role.PHARMACIEN && utilisateur.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Seul un pharmacien ou un administrateur peut créer une vente");
        }

        if (utilisateur.getPharmacie() == null || !pharmacieId.equals(utilisateur.getPharmacie().getId())) {
            throw new IllegalArgumentException("Utilisateur non autorisé pour cette pharmacie");
        }
        return utilisateur;
    }

    @Transactional(readOnly = true)
    public Page<VenteListDTO> listVentesByPharmacy(UUID pharmacieId, Pageable pageable) {
        return venteRepository.findByPharmacieId(pharmacieId, pageable)
                .map(VenteMapper::toListDTO);
    }

    @Transactional(readOnly = true)
    public Optional<Vente> findById(UUID id, UUID pharmacieId) {
        return venteRepository.findByIdAndPharmacieId(id, pharmacieId);
    }

    public VenteDTO updateVente(UUID id, UUID pharmacieId, VenteUpdateDTO dto) {
        Vente vente = venteRepository.findByIdAndPharmacieId(id, pharmacieId)
                .orElseThrow(() -> new ResourceNotFoundException("Vente not found"));

        vente.setStatut(dto.getStatut());
        Vente updated = venteRepository.save(vente);
        log.info("Vente updated: {} (new status={})", id, dto.getStatut());
        
        return VenteMapper.toDTO(updated);
    }

    public void deleteVente(UUID id, UUID pharmacieId) {
        Vente vente = venteRepository.findByIdAndPharmacieId(id, pharmacieId)
                .orElseThrow(() -> new ResourceNotFoundException("Vente not found"));

        // Set status to ANNULEE before deletion to preserve history
        vente.setStatut(StatutVente.ANNULEE);
        venteRepository.save(vente);
        log.info("Vente marked as cancelled: {}", id);
    }
}
