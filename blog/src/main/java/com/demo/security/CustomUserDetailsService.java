package com.demo.security;

import com.demo.entity.User;
import com.demo.exception.UserNotFoundException;
import com.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger LOG = LoggerFactory.getLogger(CustomUserDetailsService.class);
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
//            User user = userOpt.orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
            User user = userOpt.get();
            return new CustomUserDetails(user.getId(), user.getEmail(), user.getPassword(),
                    List.of(new SimpleGrantedAuthority(user.getRole())), user.isActive());
        } else {
            LOG.info("User not found with email: " + email);
            return new CustomUserDetails(null, null, null, null, false);
        }
    }
}
