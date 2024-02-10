package com.demo.security;

import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class CustomAuthenticationFilter extends OncePerRequestFilter {

    Logger LOG = LoggerFactory.getLogger(CustomAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        LOG.info(">>> Inside doFilterInternal");

        // Extract JWT token from request
        Optional<String> tokenOpt = getTokenFromHeader(request);

        if (tokenOpt.isPresent()) {
            final String token = tokenOpt.get();

            LOG.info(">>> Inside doFilterInternal If statement");

            try {
                // Verify and decode token
                DecodedJWT decodeJWT = JwtUtil.verifyToken(token);

                // Get principal from decoded token
                CustomUserDetails principal = JwtUtil.getPrincipal(decodeJWT);

                // Pass it as Security Context
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            } catch (Exception ex) {
                LOG.error(ex.getMessage());
            }
        }

//        getTokenFromHeader(request)
//                .map(JwtUtil::verifyToken)
//                .map(JwtUtil::getPrincipal)
//                .map(CustomUserPrincipalAuthenticationToken::new)
//                .ifPresent(authentication -> SecurityContextHolder.getContext().setAuthentication(authentication));

        filterChain.doFilter(request, response);
    }

    private Optional<String> getTokenFromHeader(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            return Optional.of(token);
        }
        return Optional.empty();
    }
}
