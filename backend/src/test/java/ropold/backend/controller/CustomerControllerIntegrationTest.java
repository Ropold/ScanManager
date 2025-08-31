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
import ropold.backend.model.CustomerModel;
import ropold.backend.repository.CustomerRepository;

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
class CustomerControllerIntegrationTest {

    @MockitoBean
    private Cloudinary cloudinary;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CustomerRepository customerRepository;

    @BeforeEach
    void setup() {
        customerRepository.deleteAll();

        CustomerModel customerModel1 = new CustomerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000001"),
                "DEB-2024-001",
                "Max Mustermann",
                "Contact Person1",
                "Musterstraße 123, 12345 Berlin, Tel: +49 30 123456, Email: kontakt@mustermann.de",
                "Notes1",
                "http://example.com/customer1.jpg",
                false
        );

        CustomerModel customerModel2 = new CustomerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000002"),
                "DEB-2024-002",
                "Erika Musterfrau",
                "Contact Person2",
                "Beispielweg 45, 80331 München, Tel: +49 89 987654, Email: info@musterfrau.com",
                "Notes2",
                "http://example.com/customer2.jpg",
                false
        );

        CustomerModel customerModel3 = new CustomerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000003"),
                "DEB-2024-003",
                "Hans Beispiel",
                "Contact Person3",
                "Teststraße 78, 50667 Köln, Tel: +49 221 555123, Email: kontakt@beispiel.de",
                "Notes3",
                "http://example.com/customer3.jpg",
                true
        );

        customerRepository.saveAll(java.util.List.of(customerModel1, customerModel2, customerModel3));
    }

    @Test
    void testGetAllCustomers_shouldReturnAllCustomers() throws Exception {
        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Erika Musterfrau"))
                .andExpect(jsonPath("$[1].name").value("Max Mustermann"));
    }

    @Test
    void testGetArchivedCustomers_shouldReturnArchivedCustomers() throws Exception {
        mockMvc.perform(get("/api/customers/archived"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void testGetCustomerById_shouldReturnCustomer() throws Exception {
        mockMvc.perform(get("/api/customers/00000000-0000-0000-0000-000000000001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Max Mustermann"))
                .andExpect(jsonPath("$.contactPerson").value("Contact Person1"))
                .andExpect(jsonPath("$.notes").value("Notes1"));
    }

    @Test
    void testGetCustomerById_notFound() throws Exception {
        mockMvc.perform(get("/api/customers/00000000-0000-0000-0000-000000000999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "test-user", authorities = {"OIDC_USER"})
    void testToggleArchiveStatus_shouldToggleFromActiveToArchived() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("test-user");
        when(mockOAuth2User.getAttribute("sub")).thenReturn("microsoft-id-123");

        OAuth2AuthenticationToken authToken = new OAuth2AuthenticationToken(
                mockOAuth2User,
                List.of(new SimpleGrantedAuthority("OIDC_USER")),
                "azure"
        );

        SecurityContextHolder.getContext().setAuthentication(authToken);

        // Verify customer is initially not archived
        CustomerModel customer = customerRepository.findById(java.util.UUID.fromString("00000000-0000-0000-0000-000000000001")).orElseThrow();
        Assertions.assertFalse(customer.getIsArchived());

        mockMvc.perform(MockMvcRequestBuilders.put("/api/customers/00000000-0000-0000-0000-000000000001/archive"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("00000000-0000-0000-0000-000000000001"))
                .andExpect(jsonPath("$.name").value("Max Mustermann"))
                .andExpect(jsonPath("$.isArchived").value(true));

        // Verify customer is now archived in database
        CustomerModel updatedCustomer = customerRepository.findById(java.util.UUID.fromString("00000000-0000-0000-0000-000000000001")).orElseThrow();
        Assertions.assertTrue(updatedCustomer.getIsArchived());
    }

    @Test
    @WithMockUser(username = "test-user", authorities = {"OIDC_USER"})
    void testToggleArchiveStatus_shouldToggleFromArchivedToActive() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("test-user");
        when(mockOAuth2User.getAttribute("sub")).thenReturn("microsoft-id-123");

        OAuth2AuthenticationToken authToken = new OAuth2AuthenticationToken(
                mockOAuth2User,
                List.of(new SimpleGrantedAuthority("OIDC_USER")),
                "azure"
        );

        SecurityContextHolder.getContext().setAuthentication(authToken);

        // Use archived customer (customerModel3)
        mockMvc.perform(MockMvcRequestBuilders.put("/api/customers/00000000-0000-0000-0000-000000000003/archive"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("00000000-0000-0000-0000-000000000003"))
                .andExpect(jsonPath("$.name").value("Hans Beispiel"))
                .andExpect(jsonPath("$.isArchived").value(false));

        // Verify customer is now active in database
        CustomerModel updatedCustomer = customerRepository.findById(java.util.UUID.fromString("00000000-0000-0000-0000-000000000003")).orElseThrow();
        Assertions.assertFalse(updatedCustomer.getIsArchived());
    }

    @Test
    void testToggleArchiveStatus_shouldReturnForbiddenWhenNotAuthenticated() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.put("/api/customers/00000000-0000-0000-0000-000000000001/archive"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "test-user", authorities = {"OIDC_USER"})
    void testPostCustomer_shouldReturnCreated() throws Exception {
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

        customerRepository.deleteAll();

        mockMvc.perform(multipart("/api/customers")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("customerModel", "", "application/json", """
                {
                  "name": "Max Mustermann3",
                  "contactPerson": "Contact Person3",
                  "notes": "Notes3"
                }
                """.getBytes())))
                .andExpect(status().isCreated());

        List<CustomerModel> allCustomers = customerRepository.findAll();
        Assertions.assertEquals(1, allCustomers.size());
    }

    @Test
    void testPostCustomer_shouldReturnForbiddenWhenNotAuthenticated() throws Exception {
        mockMvc.perform(multipart("/api/customers")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("customerModel", "", "application/json", """
                {
                  "name": "Max Mustermann3",
                  "contactPerson": "Contact Person3",
                  "notes": "Notes3"
                }
                """.getBytes())))
                .andExpect(status().isForbidden());

        List<CustomerModel> allCustomers = customerRepository.findAll();
        Assertions.assertEquals(3, allCustomers.size());
    }

    @Test
    @WithMockUser(username = "test-user", authorities = {"OIDC_USER"})
    void testUpdateCustomerWithPut() throws Exception {
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

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/customers/00000000-0000-0000-0000-000000000001")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("customerModel", "", "application/json", """
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

        CustomerModel updated = customerRepository.findById(java.util.UUID.fromString("00000000-0000-0000-0000-000000000001")).orElseThrow();
        Assertions.assertEquals("Max Mustermann Updated", updated.getName());
        Assertions.assertEquals("Contact Person1 Updated", updated.getContactPerson());
        Assertions.assertEquals("Notes1 Updated", updated.getNotes());
        Assertions.assertEquals("https://example.com/updated-image.jpg", updated.getImageUrl());

    }

    @Test
    @WithMockUser(username = "test-user", authorities = {"OIDC_USER"})
    void testDeleteCustomer_shouldReturnNoContent() throws Exception {
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

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/customers/00000000-0000-0000-0000-000000000001"))
                .andExpect(status().isNoContent());
        Assertions.assertFalse(customerRepository.existsById(java.util.UUID.fromString("00000000-0000-0000-0000-000000000001")));
    }


}
