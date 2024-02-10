package com.demo.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;

public class CustomUserPrincipalAuthenticationToken extends AbstractAuthenticationToken {

    private final CustomUserDetails principal;
    public CustomUserPrincipalAuthenticationToken(CustomUserDetails principal) {
        super(principal.getAuthorities());
        this.principal = principal;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }
}
