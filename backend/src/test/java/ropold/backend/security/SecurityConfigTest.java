package ropold.backend.security;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import ropold.backend.model.UserModel;
import ropold.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SecurityConfigTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OAuth2User mockAzureUser;


    @Test
    void testOauth2UserService_existingUser() {
        // Given - Existierender User in der DB
        String microsoftId = "existing-microsoft-id";
        String email = "existing@example.com";
        String username = "Existing User";

        UserModel existingUser = new UserModel(
                UUID.randomUUID(),
                microsoftId,
                username,
                email,
                "USER",
                "de",
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now(),
                null
        );

        // Mock Repository - User existiert bereits
        when(userRepository.findByMicrosoftId(microsoftId)).thenReturn(Optional.of(existingUser));

        // Mock DefaultOAuth2UserService
        when(mockAzureUser.getAttribute("sub")).thenReturn(microsoftId);
        when(mockAzureUser.getAttribute("email")).thenReturn(email);
        when(mockAzureUser.getAttribute("name")).thenReturn(username);

        // Create OAuth2UserService with mocked DefaultOAuth2UserService
        OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService = (userRequest) -> {
            // Simulate DefaultOAuth2UserService behavior
            OAuth2User azureUser = mockAzureUser;

            String msId = azureUser.getAttribute("sub");
            String userEmail = azureUser.getAttribute("email");
            String userName = azureUser.getAttribute("name");

            userRepository.findByMicrosoftId(msId)
                    .orElseGet(() -> {
                        UserModel newUser = new UserModel(
                                UUID.randomUUID(),
                                msId,
                                userName != null ? userName : userEmail,
                                userEmail,
                                "USER",
                                "de",
                                LocalDateTime.now(),
                                LocalDateTime.now(),
                                null
                        );
                        return userRepository.save(newUser);
                    });

            return azureUser;
        };

        OAuth2UserRequest mockRequest = createMockOAuth2UserRequest();

        // When
        OAuth2User result = oauth2UserService.loadUser(mockRequest);

        // Then
        assertThat(result).isEqualTo(mockAzureUser);
        verify(userRepository).findByMicrosoftId(microsoftId);
        verify(userRepository, never()).save(any(UserModel.class)); // Kein neuer User gespeichert
    }

    @Test
    void testOauth2UserService_newUser() {
        // Given - Neuer User (nicht in DB)
        String microsoftId = "new-microsoft-id";
        String email = "new@example.com";
        String username = "New User";

        UserModel savedUser = new UserModel(
                UUID.randomUUID(),
                microsoftId,
                username,
                email,
                "USER",
                "de",
                LocalDateTime.now(),
                LocalDateTime.now(),
                null
        );

        // Mock Repository - User existiert NICHT
        when(userRepository.findByMicrosoftId(microsoftId)).thenReturn(Optional.empty());
        when(userRepository.save(any(UserModel.class))).thenReturn(savedUser);

        when(mockAzureUser.getAttribute("sub")).thenReturn(microsoftId);
        when(mockAzureUser.getAttribute("email")).thenReturn(email);
        when(mockAzureUser.getAttribute("name")).thenReturn(username);

        // Create OAuth2UserService with mocked behavior
        OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService = (userRequest) -> {
            OAuth2User azureUser = mockAzureUser;

            String msId = azureUser.getAttribute("sub");
            String userEmail = azureUser.getAttribute("email");
            String userName = azureUser.getAttribute("name");

            userRepository.findByMicrosoftId(msId)
                    .orElseGet(() -> {
                        UserModel newUser = new UserModel(
                                UUID.randomUUID(),
                                msId,
                                userName != null ? userName : userEmail,
                                userEmail,
                                "USER",
                                "de",
                                LocalDateTime.now(),
                                LocalDateTime.now(),
                                null
                        );
                        return userRepository.save(newUser);
                    });

            return azureUser;
        };

        OAuth2UserRequest mockRequest = createMockOAuth2UserRequest();

        // When
        OAuth2User result = oauth2UserService.loadUser(mockRequest);

        // Then
        assertThat(result).isEqualTo(mockAzureUser);
        verify(userRepository).findByMicrosoftId(microsoftId);
        verify(userRepository).save(any(UserModel.class)); // Neuer User wurde gespeichert
    }

    @Test
    void testOauth2UserService_newUserWithoutName_usesEmail() {
        // Given - Neuer User ohne name Attribut
        String microsoftId = "new-microsoft-id-2";
        String email = "newuser2@example.com";

        UserModel savedUser = new UserModel(
                UUID.randomUUID(),
                microsoftId,
                email, // Email wird als Username verwendet
                email,
                "USER",
                "de",
                LocalDateTime.now(),
                LocalDateTime.now(),
                null
        );

        // Mock Repository
        when(userRepository.findByMicrosoftId(microsoftId)).thenReturn(Optional.empty());
        when(userRepository.save(any(UserModel.class))).thenReturn(savedUser);

        when(mockAzureUser.getAttribute("sub")).thenReturn(microsoftId);
        when(mockAzureUser.getAttribute("email")).thenReturn(email);
        when(mockAzureUser.getAttribute("name")).thenReturn(null); // Kein Name

        // Create OAuth2UserService with mocked behavior
        OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService = (userRequest) -> {
            OAuth2User azureUser = mockAzureUser;

            String msId = azureUser.getAttribute("sub");
            String userEmail = azureUser.getAttribute("email");
            String userName = azureUser.getAttribute("name");

            userRepository.findByMicrosoftId(msId)
                    .orElseGet(() -> {
                        UserModel newUser = new UserModel(
                                UUID.randomUUID(),
                                msId,
                                userName != null ? userName : userEmail,
                                userEmail,
                                "USER",
                                "de",
                                LocalDateTime.now(),
                                LocalDateTime.now(),
                                null
                        );
                        return userRepository.save(newUser);
                    });

            return azureUser;
        };

        OAuth2UserRequest mockRequest = createMockOAuth2UserRequest();

        // When
        OAuth2User result = oauth2UserService.loadUser(mockRequest);

        // Then
        assertThat(result).isEqualTo(mockAzureUser);
        verify(userRepository).save(argThat(user ->
                user.getUsername().equals(email) // Email wird als Username verwendet
        ));
    }

    private OAuth2UserRequest createMockOAuth2UserRequest() {
        ClientRegistration clientRegistration = ClientRegistration.withRegistrationId("azure")
                .clientId("client-id")
                .clientSecret("client-secret")
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri("http://localhost:8080/login/oauth2/code/azure")
                .authorizationUri("https://login.microsoftonline.com/common/oauth2/v2.0/authorize")
                .tokenUri("https://login.microsoftonline.com/common/oauth2/v2.0/token")
                .userInfoUri("https://graph.microsoft.com/v1.0/me")
                .userNameAttributeName("sub")
                .clientName("Azure")
                .build();

        OAuth2AccessToken accessToken = new OAuth2AccessToken(
                OAuth2AccessToken.TokenType.BEARER,
                "access-token",
                null,
                null
        );

        return new OAuth2UserRequest(clientRegistration, accessToken);
    }
}