package com.example.mangment_pfarmacy_v2.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

/**
 * Configuration JWT (si besoin de classe dédiée)
 * Les propriétés JWT sont lues depuis application.properties:
 * - jwt.secret
 * - jwt.expiration
 * - jwt.refresh-expiration
 */
@Component
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
public class JwtConfig {

    private String secret;
    private long expiration;
    private long refreshExpiration;
}
