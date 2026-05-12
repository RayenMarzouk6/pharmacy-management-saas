package com.example.mangment_pfarmacy_v2.common.security;

import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Intercepteur Spring qui initialise le TenantContext à partir du JWT.
 * Nettoit le contexte après chaque requête.
 */
@Component
public class TenantInterceptor implements HandlerInterceptor {

    private static final String PHARMACIE_ID_ATTRIBUTE = "pharmacieId";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws IOException {
        // Récupère le pharmacieId du JWT (injecté par le JwtAuthFilter)
        Object pharmacieIdObj = request.getAttribute(PHARMACIE_ID_ATTRIBUTE);
        
        if (pharmacieIdObj instanceof UUID) {
            TenantContext.setPharmacieId((UUID) pharmacieIdObj);
        }
        
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
                               Exception ex) {
        // Nettoie le ThreadLocal après la requête
        TenantContext.clear();
    }
}
