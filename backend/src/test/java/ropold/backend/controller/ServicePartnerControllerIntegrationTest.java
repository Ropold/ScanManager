package ropold.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ropold.backend.model.ServicePartnerModel;
import ropold.backend.repository.ServicePartnerRepository;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ServicePartnerControllerIntegrationTest {

    @MockitoBean
    private Cloudinary cloudinary;

    @Autowired
    private ServicePartnerRepository servicePartnerRepository;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        servicePartnerRepository.deleteAll();

        ServicePartnerModel servicePartnerModel1 = new ServicePartnerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000001"),
                "KRED-3001",
                "Test Partner 1",
                "Contact Person 1",
                "Teststraße 10, 40210 Düsseldorf, Tel: +49 211 123456, Email: info@partner1.de",
                "Notes 1",
                "http://partner1.com",
                false
        );

        ServicePartnerModel servicePartnerModel2 = new ServicePartnerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000002"),
                "KRED-3002",
                "Test Partner 2",
                "Contact Person 2",
                "Musterweg 20, 60594 Frankfurt, Tel: +49 69 987654, Email: service@partner2.de",
                "Notes 2",
                "http://partner2.com",
                false
        );

        servicePartnerRepository.saveAll(java.util.List.of(servicePartnerModel1, servicePartnerModel2));
    }

    @Test
    void testGetAllServicePartners() throws Exception {
       mockMvc.perform(get("/api/service-partners"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.length()").value(2))
               .andExpect(jsonPath("$[0].name").value("Test Partner 1"))
               .andExpect(jsonPath("$[1].name").value("Test Partner 2"));
    }

    @Test
    void testGetAllArchivedServicePartners() throws Exception {
       mockMvc.perform(get("/api/service-partners/archived"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void testGetServicePartnerById() throws Exception {
        mockMvc.perform(get("/api/service-partners/00000000-0000-0000-0000-000000000001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Partner 1"))
                .andExpect(jsonPath("$.contactPerson").value("Contact Person 1"));
    }

    @Test
    void testGetServicePartnerById_NotFound() throws Exception {
        mockMvc.perform(get("/api/service-partners/00000000-0000-0000-0000-000000000999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "test-user", authorities = {"OIDC_USER"})
    void testPostServicePartner() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("test-user");
        when(mockOAuth2User.getAttribute("sub")).thenReturn("microsoft-id-123");

        OAuth2AuthenticationToken authToken = new OAuth2AuthenticationToken(
                mockOAuth2User,
                List.of(new SimpleGrantedAuthority("OIDC_USER")),
                "azure"  // registrationId wichtig!
        );

        SecurityContextHolder.getContext().setAuthentication(authToken);

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://www.test.de/"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        servicePartnerRepository.deleteAll();

        mockMvc.perform(multipart("/api/service-partners")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("servicePartnerModel", "", "application/json", """
                {
                  "name": "Max Mustermann 3",
                  "contactPerson": "Contact Person 3",
                  "notes": "Notes3"
                }
                """.getBytes())))
                .andExpect(status().isCreated());

        List<ServicePartnerModel> allPartners = servicePartnerRepository.findAll();
        Assertions.assertEquals(1, allPartners.size());
        Assertions.assertEquals("Max Mustermann 3", allPartners.getFirst().getName());
    }

    @Test
    void testPostServicePartner_Unauthorized() throws Exception {
        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://www.test.de/"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        servicePartnerRepository.deleteAll();
        mockMvc.perform(multipart("/api/service-partners")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("servicePartnerModel", "", "application/json", """
                {
                  "name": "Max Mustermann 3",
                  "contactPerson": "Contact Person 3",
                  "notes": "Notes 3"
                }
                """.getBytes())))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "test-user", authorities = {"OIDC_USER"})
    void testUpdateServicePartnerWithPut() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("test-user");
        when(mockOAuth2User.getAttribute("sub")).thenReturn("microsoft-id-123");

        OAuth2AuthenticationToken authToken = new OAuth2AuthenticationToken(
                mockOAuth2User,
                List.of(new SimpleGrantedAuthority("OIDC_USER")),
                "azure"  // registrationId wichtig!
        );

        SecurityContextHolder.getContext().setAuthentication(authToken);

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://example.com/updated-image.jpg"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/service-partners/00000000-0000-0000-0000-000000000001")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("servicePartnerModel", "", "application/json", """
                        {
                          "id": "00000000-0000-0000-0000-000000000001",
                          "name": "Max Mustermann Updated",
                          "contactPerson": "Contact Person1 Updated",
                          "notes": "Notes1 Updated",
                          "imageUrl": "https://example.com/updated-image.jpg"
                        }
                    """.getBytes()))
                        .contentType("multipart/form-data")
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Max Mustermann Updated"))
                .andExpect(jsonPath("$.contactPerson").value("Contact Person1 Updated"))
                .andExpect(jsonPath("$.notes").value("Notes1 Updated"))
                .andExpect(jsonPath("$.imageUrl").value("https://example.com/updated-image.jpg"));

        ServicePartnerModel updated = servicePartnerRepository.findById(java.util.UUID.fromString("00000000-0000-0000-0000-000000000001")).orElseThrow();
        Assertions.assertEquals("Max Mustermann Updated", updated.getName());
        Assertions.assertEquals("Contact Person1 Updated", updated.getContactPerson());
        Assertions.assertEquals("Notes1 Updated", updated.getNotes());
        Assertions.assertEquals("https://example.com/updated-image.jpg", updated.getImageUrl());
    }

    @Test
    @WithMockUser(username = "test-user", authorities = {"OIDC_USER"})
    void testDeleteServicePartner() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("test-user");
        when(mockOAuth2User.getAttribute("sub")).thenReturn("microsoft-id-123");

        OAuth2AuthenticationToken authToken = new OAuth2AuthenticationToken(
                mockOAuth2User,
                List.of(new SimpleGrantedAuthority("OIDC_USER")),
                "azure"  // registrationId wichtig!
        );

        SecurityContextHolder.getContext().setAuthentication(authToken);

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://example.com/updated-image.jpg"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/service-partners/00000000-0000-0000-0000-000000000001"))
                .andExpect(status().isNoContent());
        Assertions.assertFalse(servicePartnerRepository.existsById(java.util.UUID.fromString("00000000-0000-0000-0000-000000000001")));
    }

}
