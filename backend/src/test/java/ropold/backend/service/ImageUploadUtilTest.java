package ropold.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.never;

class ImageUploadUtilTest {

    CloudinaryService cloudinaryService = mock(CloudinaryService.class);
    ImageUploadUtil imageUploadUtil = new ImageUploadUtil(cloudinaryService);


    @Test
    void determineImageUrl_uploadsImage_whenImageProvided() throws IOException {
        MultipartFile image = mock(MultipartFile.class);
        when(image.isEmpty()).thenReturn(false);
        when(cloudinaryService.uploadImage(image)).thenReturn("uploadedUrl");

        String result = imageUploadUtil.determineImageUrl(image, "frontendUrl", "existingUrl");
        assertEquals("uploadedUrl", result);
    }

    @Test
    void determineImageUrl_returnsNull_whenNoImageAndFrontendUrlBlank() throws IOException {
        String result = imageUploadUtil.determineImageUrl(null, "", "existingUrl");
        assertNull(result);
    }

    @Test
    void determineImageUrl_returnsExistingUrl_whenNoImageAndFrontendUrlPresent() throws IOException {
        String result = imageUploadUtil.determineImageUrl(null, "frontendUrl", "existingUrl");
        assertEquals("existingUrl", result);
    }

    @Test
    void cleanupOldImageIfNeeded_deletesImage_whenImageShouldBeDeleted() {
        imageUploadUtil.cleanupOldImageIfNeeded("oldUrl", "newUrl");
        verify(cloudinaryService, times(1)).deleteImage("oldUrl");
    }

    @Test
    void cleanupOldImageIfNeeded_doesNothing_whenNoCleanupNeeded() {
        imageUploadUtil.cleanupOldImageIfNeeded("sameUrl", "sameUrl");
        verify(cloudinaryService, never()).deleteImage(any());
    }
}
