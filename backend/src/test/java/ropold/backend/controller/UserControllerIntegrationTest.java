package ropold.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import ropold.backend.model.UserModel;
import ropold.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        UserModel user1 = new UserModel(
                UUID.fromString("00000000-0000-0000-0000-000000000001"),
                "microsoftId1",
                "userName1",
                "email1@example.com",
                "USER",
                "de",
                LocalDateTime.of(2024, 1, 1, 12, 0),
                LocalDateTime.of(2024, 1, 1, 12, 30),
                "https://www.avatar.com/user1.jpg"
        );

        userRepository.save(user1);
    }

    @Test
    @WithMockUser(username = "microsoftId1", authorities = {"OIDC_USER"})
    void testGetMe() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("test-user");
        when(mockOAuth2User.getAttribute("sub")).thenReturn("microsoft-id-123");

        OAuth2AuthenticationToken authToken = new OAuth2AuthenticationToken(
                mockOAuth2User,
                List.of(new SimpleGrantedAuthority("OIDC_USER")),
                "azure"  // registrationId wichtig!
        );

        SecurityContextHolder.getContext().setAuthentication(authToken);

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(content().string("test-user"));
    }

    @Test
    void testGetMe_Unauthenticated() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(content().string("anonymousUser"));
    }

    @Test
    void testGetUserDetails_withLoggedInUser() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getAttribute("sub")).thenReturn("microsoftId1");
        when(mockOAuth2User.getAttribute("name")).thenReturn("userName1");
        when(mockOAuth2User.getAttribute("email")).thenReturn("email1@example.com");
        when(mockOAuth2User.getAttribute("preferred_username")).thenReturn("userName1");

        OAuth2AuthenticationToken authToken = new OAuth2AuthenticationToken(
                mockOAuth2User,
                List.of(new SimpleGrantedAuthority("OIDC_USER")),
                "azure"
        );

        SecurityContextHolder.getContext().setAuthentication(authToken);

        mockMvc.perform(get("/api/users/me/details"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value("00000000-0000-0000-0000-000000000001"))
                .andExpect(jsonPath("$.microsoftId").value("microsoftId1"))
                .andExpect(jsonPath("$.username").value("userName1"))
                .andExpect(jsonPath("$.email").value("email1@example.com"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.preferredLanguage").value("de"))
                .andExpect(jsonPath("$.avatarUrl").value("https://www.avatar.com/user1.jpg"))
                .andExpect(jsonPath("$.createdAt").exists())
                .andExpect(jsonPath("$.lastLoginAt").exists());
    }

    @Test
    void testSetPreferredLanguage_withLoggedInUser() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getAttribute("sub")).thenReturn("microsoftId1");

        OAuth2AuthenticationToken authToken = new OAuth2AuthenticationToken(
                mockOAuth2User,
                List.of(new SimpleGrantedAuthority("OIDC_USER")),
                "azure"
        );

        SecurityContextHolder.getContext().setAuthentication(authToken);

        mockMvc.perform(post("/api/users/me/language/en"))
                .andExpect(status().isOk());

        // Verifizieren, dass die Sprache in der DB geändert wurde
        UserModel updatedUser = userRepository.findByMicrosoftId("microsoftId1").orElse(null);
        assertThat(updatedUser).isNotNull();
        assertThat(updatedUser.getPreferredLanguage()).isEqualTo("en");
    }

    @Test
    void testSetPreferredLanguage_unauthenticated() throws Exception {
        mockMvc.perform(post("/api/users/me/language/en"))
                .andExpect(status().isForbidden());
    }

}
