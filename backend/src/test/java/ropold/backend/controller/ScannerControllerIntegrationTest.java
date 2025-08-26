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
import ropold.backend.model.*;
import ropold.backend.repository.CustomerRepository;
import ropold.backend.repository.ScannerRepository;
import ropold.backend.repository.ServicePartnerRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
class ScannerControllerIntegrationTest {

    @MockitoBean
    private Cloudinary cloudinary;

    @Autowired
    private ScannerRepository scannerRepository;

    @Autowired
    private ServicePartnerRepository servicePartnerRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        customerRepository.deleteAll();
        servicePartnerRepository.deleteAll();
        scannerRepository.deleteAll();

        ServicePartnerModel servicePartnerModel1 = new ServicePartnerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000011"),
                "Test Partner 1",
                "Contact Person 1",
                "Notes 1",
                "http://partner1.com"
        );

        CustomerModel customerModel1 = new CustomerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000101"),
                "Max Mustermann",
                "Contact Person1",
                "Notes1",
                "http://example.com/customer1.jpg"
        );

        ScannerModel scannerModel1 = new ScannerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000001"),
                UUID.fromString("00000000-0000-0000-0000-000000000101"),
                UUID.fromString("00000000-0000-0000-0000-000000000011"),
                "Test Scanner",
                "SN-001",
                "CN-001",
                "IN-001",
                DeviceType.SCANNER,
                ContractType.AUTORENEWAL,
                ScannerStatus.ACTIVE,
                false,
                LocalDate.of(2024, 1, 1),
                LocalDate.of(2027, 1, 1),
                new BigDecimal("1500.00"),
                new BigDecimal("1800.00"),
                new BigDecimal("300.00"),
                "Standard maintenance",
                "Test note",
                "http://example.com/scanner1.jpg"
        );

        ScannerModel scannerModel2 = new ScannerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000002"),
                UUID.fromString("00000000-0000-0000-0000-000000000101"),
                UUID.fromString("00000000-0000-0000-0000-000000000011"),
                "Test Scanner 2",
                "SN-002",
                "CN-002",
                "IN-002",
                DeviceType.SCANNER,
                ContractType.AUTORENEWAL,
                ScannerStatus.ACTIVE,
                false,
                LocalDate.of(2024, 2, 1),
                LocalDate.of(2027, 2, 1),
                new BigDecimal("1600.00"),
                new BigDecimal("1900.00"),
                new BigDecimal("350.00"),
                "Premium maintenance",
                "Test note 2",
                "http://example.com/scanner2.jpg"
        );

        servicePartnerRepository.save(servicePartnerModel1);
        customerRepository.save(customerModel1);
        scannerRepository.saveAll(List.of(scannerModel1, scannerModel2));
    }

    @Test
    void testGetAllScanners() throws  Exception {
        mockMvc.perform(get("/api/scanners"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].deviceName").value("Test Scanner"))
                .andExpect(jsonPath("$[1].deviceName").value("Test Scanner 2"));
    }

    @Test
    void testGetScannerById() throws Exception {
        mockMvc.perform(get("/api/scanners/00000000-0000-0000-0000-000000000001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deviceName").value("Test Scanner"))
                .andExpect(jsonPath("$.serialNumber").value("SN-001"));
    }

    @Test
    @WithMockUser(username = "test-user", authorities = {"OIDC_USER"})
    void testPostScanner_shouldReturnCreated() throws Exception {
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

        scannerRepository.deleteAll();

        mockMvc.perform(multipart("/api/scanners")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("scannerModel", "", "application/json", """
           {
             "customerId": "00000000-0000-0000-0000-000000000101",
             "servicePartnerId": "00000000-0000-0000-0000-000000000011",
             "deviceName": "Test Scanner 3",
             "serialNumber": "SN-003",
             "contractNumber": "CN-003",
             "invoiceNumber": "IN-003",
             "deviceType": "SCANNER",
             "contractType": "AUTORENEWAL",
             "status": "ACTIVE",
             "noMaintenance": false,
             "startDate": "2024-03-01",
             "endDate": "2027-03-01",
             "purchasePrice": 1700.00,
             "salePrice": 2000.00,
             "depreciation": 400.00,
             "maintenanceContent": "Test maintenance",
             "note": "Test note 3"
           }
           """.getBytes())))
                .andExpect(status().isCreated());

        List<ScannerModel> scanners = scannerRepository.findAll();
        Assertions.assertEquals(1, scanners.size());
    }

    @Test
    void testPostScanner_shouldReturnForbiddenWhenNotAuthenticated() throws Exception {
        mockMvc.perform(multipart("/api/scanners")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("scannerModel", "", "application/json", """
           {
             "customerId": "00000000-0000-0000-0000-000000000101",
             "servicePartnerId": "00000000-0000-0000-0000-000000000011",
             "deviceName": "Test Scanner 3",
             "serialNumber": "SN-003",
             "contractNumber": "CN-003",
             "invoiceNumber": "IN-003",
             "deviceType": "SCANNER",
             "contractType": "AUTORENEWAL",
             "status": "ACTIVE",
             "noMaintenance": false,
             "startDate": "2024-03-01",
             "endDate": "2027-03-01",
             "purchasePrice": 1700.00,
             "salePrice": 2000.00,
             "depreciation": 400.00,
             "maintenanceContent": "Test maintenance",
             "note": "Test note 3"
           }
           """.getBytes())))
                .andExpect(status().isForbidden());

        List<ScannerModel> scanners = scannerRepository.findAll();
        Assertions.assertEquals(2, scanners.size());
    }

    @Test
    @WithMockUser(username = "test-user", authorities = {"OIDC_USER"})
    void testUpdateScannerWithPut() throws Exception{

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

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/scanners/00000000-0000-0000-0000-000000000001")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("scannerModel", "", "application/json", """
                        {
                         "id": "00000000-0000-0000-0000-000000000001",
                         "customerId": "00000000-0000-0000-0000-000000000101",
                         "servicePartnerId": "00000000-0000-0000-0000-000000000011",
                         "deviceName": "Test Scanner 3 Updated",
                         "serialNumber": "SN-003",
                         "contractNumber": "CN-003",
                         "invoiceNumber": "IN-003",
                         "deviceType": "SCANNER",
                         "contractType": "AUTORENEWAL",
                         "status": "ACTIVE",
                         "noMaintenance": false,
                         "startDate": "2024-03-01",
                         "endDate": "2027-03-01",
                         "purchasePrice": 1700.00,
                         "salePrice": 2000.00,
                         "depreciation": 400.00,
                         "maintenanceContent": "Test maintenance",
                         "note": "Test note 3",
                         "imageUrl": "https://example.com/updated-image.jpg"
                        }
                    """.getBytes()))
                        .contentType("multipart/form-data")
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deviceName").value("Test Scanner 3 Updated"))
                .andExpect(jsonPath("$.imageUrl").value("https://example.com/updated-image.jpg"));

        ScannerModel updatedScanner = scannerRepository.findById(UUID.fromString("00000000-0000-0000-0000-000000000001")).orElseThrow();
        Assertions.assertEquals("Test Scanner 3 Updated", updatedScanner.getDeviceName());
        Assertions.assertEquals("https://example.com/updated-image.jpg", updatedScanner.getImageUrl());
    }

    @Test
    @WithMockUser(username = "test-user", authorities = {"OIDC_USER"})
    void testDeleteScanner() throws Exception {
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

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/scanners/00000000-0000-0000-0000-000000000001"))
                .andExpect(status().isNoContent());
        Assertions.assertFalse(scannerRepository.existsById(java.util.UUID.fromString("00000000-0000-0000-0000-000000000001")));
    }

}
