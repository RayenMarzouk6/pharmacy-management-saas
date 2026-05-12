package com.example.mangment_pfarmacy_v2.common.security;

import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Filtre pour nettoyer le TenantContext après chaque requête.
 * Utilisé pour éviter les fuites de mémoire ThreadLocal.
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest req,
            HttpServletResponse res, FilterChain chain) throws ServletException, IOException {

        try {
            chain.doFilter(req, res);
        } finally {
            // Nettoie le TenantContext pour éviter les fuites mémoire
            TenantContext.clear();
        }
    }
}

