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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getUserById_UserExists_ReturnsUser() {
        UUID fixedId = UUID.fromString("123e4567-e89b-12d3-a456-426614174000");
        LocalDateTime fixedDate = LocalDateTime.of(2024, 1, 1, 12, 0);
        UserModel userModel = new UserModel(
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
        when(userRepository.findById(fixedId)).thenReturn(Optional.of(userModel));

        UserModel result = userService.getUserById(fixedId);
        assertNotNull(result);
        assertEquals(userModel, result);
        verify(userRepository, times(1)).findById(fixedId);

    }

}
