package ropold.backend.exception;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

    @InjectMocks
    private GlobalExceptionHandler globalExceptionHandler;

    @Test
    void testHandleRuntimeException() {
        // Given
        RuntimeException exception = new RuntimeException("Something went wrong");

        // When
        ErrorResponse response = globalExceptionHandler.handleRuntimeException(exception);

        // Then
        assertThat(response.code()).isEqualTo("INTERNAL_ERROR");
        assertThat(response.message()).isEqualTo("Something went wrong");
    }
}
