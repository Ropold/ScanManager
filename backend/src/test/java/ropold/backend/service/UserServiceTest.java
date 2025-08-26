package ropold.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.oauth2.core.user.OAuth2User;
import ropold.backend.exception.notfoundexceptions.UserNotFoundException;
import ropold.backend.model.UserModel;
import ropold.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private UUID fixedId;
    private LocalDateTime fixedDate;
    private UserModel testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        fixedId = UUID.fromString("123e4567-e89b-12d3-a456-426614174000");
        fixedDate = LocalDateTime.of(2024, 1, 1, 12, 0);
        testUser = new UserModel(
                fixedId,
                "microsoftId",
                "username",
                "email@example.com",
                "ROLE_USER",
                "de",
                fixedDate,
                null,
                "avatarUrl"
        );
    }

    @Test
    void getUserById_UserExists_ReturnsUser() {
        when(userRepository.findById(fixedId)).thenReturn(Optional.of(testUser));

        UserModel result = userService.getUserById(fixedId);

        assertNotNull(result);
        assertEquals(testUser, result);
        verify(userRepository, times(1)).findById(fixedId);
    }

    @Test
    void getUserById_UserDoesNotExist_ThrowsException() {
        UUID userId = UUID.fromString("123e4567-e89b-12d3-a456-426614174001");
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> userService.getUserById(userId));
        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    void getUserByMicrosoftId_UserExists_ReturnsUser() {
        String microsoftId = "test-microsoft-id";
        when(userRepository.findByMicrosoftId(microsoftId)).thenReturn(Optional.of(testUser));

        UserModel result = userService.getUserByMicrosoftId(microsoftId);

        assertNotNull(result);
        assertEquals(testUser, result);
        verify(userRepository, times(1)).findByMicrosoftId(microsoftId);
    }

    @Test
    void getUserByMicrosoftId_UserDoesNotExist_ThrowsException() {
        String microsoftId = "non-existent-microsoft-id";
        when(userRepository.findByMicrosoftId(microsoftId)).thenReturn(Optional.empty());

        UserNotFoundException exception = assertThrows(UserNotFoundException.class,
                () -> userService.getUserByMicrosoftId(microsoftId));
        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findByMicrosoftId(microsoftId);
    }

    // Tests für createOrUpdateFromAzure
    @Test
    void createOrUpdateFromAzure_ExistingUser_UpdatesLastLogin() {
        OAuth2User mockAzureUser = mock(OAuth2User.class);
        when(mockAzureUser.getAttribute("sub")).thenReturn("microsoftId");
        when(userRepository.findByMicrosoftId("microsoftId")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(UserModel.class))).thenReturn(testUser);

        UserModel result = userService.createOrUpdateFromAzure(mockAzureUser);

        assertNotNull(result);
        assertNotNull(testUser.getLastLoginAt());
        verify(userRepository, times(1)).findByMicrosoftId("microsoftId");
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void createOrUpdateFromAzure_NewUser_CreatesUser() {
        OAuth2User mockAzureUser = mock(OAuth2User.class);
        when(mockAzureUser.getAttribute("sub")).thenReturn("new-microsoft-id");
        when(mockAzureUser.getAttribute("name")).thenReturn("New User");
        when(mockAzureUser.getAttribute("email")).thenReturn("newuser@example.com");
        when(userRepository.findByMicrosoftId("new-microsoft-id")).thenReturn(Optional.empty());

        UserModel savedUser = new UserModel(
                UUID.randomUUID(),
                "new-microsoft-id",
                "New User",
                "newuser@example.com",
                "ROLE_USER",
                "de",
                LocalDateTime.now(),
                LocalDateTime.now(),
                null
        );
        when(userRepository.save(any(UserModel.class))).thenReturn(savedUser);

        UserModel result = userService.createOrUpdateFromAzure(mockAzureUser);

        assertNotNull(result);
        verify(userRepository, times(1)).findByMicrosoftId("new-microsoft-id");
        verify(userRepository, times(1)).save(any(UserModel.class));
    }

    // Tests für setPreferredLanguage
    @Test
    void setPreferredLanguage_ValidUser_UpdatesLanguage() {
        String microsoftId = "microsoftId";
        String newLanguage = "en";
        when(userRepository.findByMicrosoftId(microsoftId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(UserModel.class))).thenReturn(testUser);

        userService.setPreferredLanguage(microsoftId, newLanguage);

        assertEquals(newLanguage, testUser.getPreferredLanguage());
        verify(userRepository, times(1)).findByMicrosoftId(microsoftId);
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void setPreferredLanguage_UserNotFound_ThrowsException() {
        String microsoftId = "non-existent-id";
        String newLanguage = "fr";
        when(userRepository.findByMicrosoftId(microsoftId)).thenReturn(Optional.empty());

        UserNotFoundException exception = assertThrows(UserNotFoundException.class,
                () -> userService.setPreferredLanguage(microsoftId, newLanguage));

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findByMicrosoftId(microsoftId);
        verify(userRepository, never()).save(any(UserModel.class));
    }
}

//createOrUpdateFromAzure, setPreferredLanguage