package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import ropold.backend.exception.notfoundexceptions.UserNotFoundException;
import ropold.backend.model.UserModel;
import ropold.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserModel getUserByMicrosoftId(String microsoftId) {
        return userRepository.findByMicrosoftId(microsoftId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    public UserModel getUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    public UserModel createOrUpdateFromAzure(OAuth2User azureUser) {
        String microsoftId = azureUser.getAttribute("sub");

        return userRepository.findByMicrosoftId(microsoftId)
                .map(existingUser -> {
                    existingUser.setLastLoginAt(LocalDateTime.now());
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {

                    UserModel newUser = new UserModel(
                            UUID.randomUUID(),
                            microsoftId,
                            azureUser.getAttribute("name"),
                            azureUser.getAttribute("email"),
                            "ROLE_USER",
                            "de",
                            LocalDateTime.now(),
                            LocalDateTime.now(),
                            null
                    );
                    return userRepository.save(newUser);
                });
    }

    public void setPreferredLanguage(String microsoftId, String languageIso) {
        UserModel user = getUserByMicrosoftId(microsoftId);
        user.setPreferredLanguage(languageIso);
        userRepository.save(user);
    }
}


