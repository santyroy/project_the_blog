package com.demo.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

public class JwtUtil {

    // TODO: Externalize the secret key
    private static final String KEY = "topSecretKey";

    public static String generateJWT(Integer userId, String username, List<String> authorities) {
        return JWT.create()
                .withSubject(String.valueOf(userId))
                .withIssuer("bloggerApp")
                .withExpiresAt(Instant.now().plus(1L, ChronoUnit.HOURS))
                .withClaim("email", username)
                .withClaim("authorities", authorities)
                .sign(Algorithm.HMAC256(KEY));
    }

    public static DecodedJWT verifyToken(final String token) {
        return JWT.require(Algorithm.HMAC256(KEY)).build().verify(token);
    }

    public static CustomUserDetails getPrincipal(DecodedJWT decodeJWT) {
        return new CustomUserDetails(
                Integer.parseInt(decodeJWT.getSubject()),
                decodeJWT.getClaim("email").asString(),
                null,
                decodeJWT.getClaim("authorities").asList(SimpleGrantedAuthority.class),
                true);
    }
}
