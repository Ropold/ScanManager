package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ropold.backend.exception.notfoundexceptions.AccessDeniedException;
import ropold.backend.model.UserModel;
import ropold.backend.service.UserService;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping(value = "/me", produces = "text/plain")
    public String getMe() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/me/details")
    public Map<String, Object> getUserDetails(@AuthenticationPrincipal OAuth2User authentication) {
        if (authentication == null) {
            return Map.of("message", "User not authenticated");
        }
        UserModel user = userService.createOrUpdateFromAzure(authentication);
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

    @PostMapping("me/language/{languageIso}")
    public void setPreferredLanguage(@PathVariable String languageIso, @AuthenticationPrincipal OAuth2User authentication) {
        if (authentication == null) {
            throw new AccessDeniedException("User not authenticated");
        }
        String microsoftId = authentication.getAttribute("sub");
        userService.setPreferredLanguage(microsoftId, languageIso);
    }

}