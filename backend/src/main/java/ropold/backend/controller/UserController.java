package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ropold.backend.exception.notfoundexceptions.AccessDeniedException;
import ropold.backend.model.UserModel;
import ropold.backend.repository.UserRepository;
import ropold.backend.service.UserService;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping(value = "/me", produces = "text/plain")
    public String getMe() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/me/details")
    public Map<String, Object> getUserDetails(@AuthenticationPrincipal OAuth2User authentication) {
        if (authentication == null) {
            return Map.of("message", "User not authenticated");
        }

        try {
            // Lade User direkt aus DB statt über UserService
            String microsoftId = authentication.getAttribute("sub");
            Optional<UserModel> userOpt = userRepository.findByMicrosoftId(microsoftId);

            if (userOpt.isEmpty()) {
                // Fallback: User existiert noch nicht, erstelle ihn
                UserModel newUser = createUserFromAuthentication(authentication);
                return createUserResponse(newUser);
            }

            UserModel user = userOpt.get();
            return createUserResponse(user);

        } catch (Exception e) {
            // Fallback für Race Conditions
            return Map.of("error", "User data temporarily unavailable, please refresh");
        }
    }

    @PostMapping("me/language/{languageIso}")
    public void setPreferredLanguage(@PathVariable String languageIso, @AuthenticationPrincipal OAuth2User authentication) {
        if (authentication == null) {
            throw new AccessDeniedException("User not authenticated");
        }
        String microsoftId = authentication.getAttribute("sub");
        userService.setPreferredLanguage(microsoftId, languageIso);
    }

    private UserModel createUserFromAuthentication(OAuth2User authentication) {
        String microsoftId = authentication.getAttribute("sub");
        String email = authentication.getAttribute("email");
        String username = authentication.getAttribute("name");

        UserModel newUser = new UserModel();
        newUser.setMicrosoftId(microsoftId);
        newUser.setUsername(username != null ? username : email);
        newUser.setEmail(email);
        newUser.setRole("USER");
        newUser.setPreferredLanguage("de");
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setLastLoginAt(LocalDateTime.now());
        newUser.setAvatarUrl(null);

        return userRepository.save(newUser);
    }

    private Map<String, Object> createUserResponse(UserModel user) {
        return Map.of(
                "id", user.getId(),
                "microsoftId", user.getMicrosoftId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "preferredLanguage", user.getPreferredLanguage(),
                "avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : "",
                "createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : "",
                "lastLoginAt", user.getLastLoginAt() != null ? user.getLastLoginAt().toString() : ""
        );
    }
}