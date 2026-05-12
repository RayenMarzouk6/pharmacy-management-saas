package com.example.mangment_pfarmacy_v2.common.security;

import java.util.UUID;

/**
 * ThreadLocal pour stocker le pharmacieId de la requête courante.
 * Utilisé pour l'implémentation du multi-tenancy.
 */
public class TenantContext {

    private static final ThreadLocal<UUID> pharmacieIdHolder = new ThreadLocal<>();

    /**
     * Définit le pharmacieId pour le thread courant
     */
    public static void setPharmacieId(UUID pharmacieId) {
        pharmacieIdHolder.set(pharmacieId);
    }

    /**
     * Récupère le pharmacieId du thread courant
     */
    public static UUID getPharmacieId() {
        return pharmacieIdHolder.get();
    }

    /**
     * Supprime le pharmacieId du thread courant
     */
    public static void clear() {
        pharmacieIdHolder.remove();
    }

    /**
     * Vérifie si un pharmacieId est défini
     */
    public static boolean isSet() {
        return pharmacieIdHolder.get() != null;
    }
}
 
