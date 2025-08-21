package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
    public Map<String, Object> getUserDetails(@AuthenticationPrincipal OAuth2User azureUser) {
        if (azureUser == null) {
            return Map.of("message", "User not authenticated");
        }
        UserModel user = userService.createOrUpdateFromAzure(azureUser);
        return Map.of(
                "id", user.getId(),
                "microsoftId", user.getMicrosoftId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : "",
                "createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : "",
                "lastLoginAt", user.getLastLoginAt() != null ? user.getLastLoginAt().toString() : ""
        );
    }
}