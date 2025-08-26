package ropold.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
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
}

//createOrUpdateFromAzure, setPreferredLanguage