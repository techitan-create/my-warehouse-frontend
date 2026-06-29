package com.example.warehouse.security;

import com.example.warehouse.entity.User;
import com.example.warehouse.repository.UserRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // @Lazy ช่วยแก้ Circular Dependency
    public OAuth2UserService(UserRepository userRepository,
            @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) {
        OAuth2User oAuth2User = super.loadUser(request);

        String email = oAuth2User.getAttribute("email");

        if (email != null) {
            userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setUsername(email.split("@")[0]);
                newUser.setEmail(email);
                newUser.setPassword(passwordEncoder.encode(
                    UUID.randomUUID().toString()));
                newUser.setRole(User.Role.STAFF);
                return userRepository.save(newUser);
            });
        }

        return oAuth2User;
    }
}