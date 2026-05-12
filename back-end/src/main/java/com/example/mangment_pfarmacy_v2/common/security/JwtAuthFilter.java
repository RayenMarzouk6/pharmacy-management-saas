package com.example.mangment_pfarmacy_v2.common.security;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Filtre JWT qui :
 * 1. Extrait le token du header Authorization
 * 2. Valide le token
 * 3. Récupère le userId et pharmacieId
 * 4. Injecte le pharmacieId dans le TenantContext
 * 5. Authentifie l'utilisateur dans Spring Security
 */
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Récupère le token du header Authorization
            String jwt = extractJwtFromRequest(request);

            if (jwt != null && jwtTokenProvider.validateToken(jwt)) {
                // Récupère le username (email) du token
                String username = jwtTokenProvider.getUsernameFromToken(jwt);
                
                // Récupère les détails de l'utilisateur
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Crée le token d'authentification
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Définit le contexte de sécurité
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Récupère et injecte le pharmacieId dans le TenantContext et le request
                UUID pharmacieId = jwtTokenProvider.getPharmacieIdFromToken(jwt);
                if (pharmacieId != null) {
                    TenantContext.setPharmacieId(pharmacieId);
                    request.setAttribute("pharmacieId", pharmacieId);
                }
            }
        } catch (Exception ex) {
            logger.error("Cannot set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Extrait le JWT du header Authorization (Bearer <token>)
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
