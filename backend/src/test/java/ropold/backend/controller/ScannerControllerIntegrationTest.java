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
                "KRED-3001",
                "Test Partner 1",
                "Contact Person 1",
                "Servicestraße 15, 70173 Stuttgart, Tel: +49 711 123456, Email: info@testpartner1.de",
                "Notes 1",
                "http://partner1.com",
                false
        );

        CustomerModel customerModel1 = new CustomerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000101"),
                "DEB-2024-001",
                "Max Mustermann",
                "Contact Person1",
                "Musterstraße 123, 12345 Berlin, Tel: +49 30 123456, Email: kontakt@mustermann.de",
                "Notes1",
                "http://example.com/customer1.jpg",
                false
        );

        ScannerModel scannerModel1 = new ScannerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000001"),
                UUID.fromString("00000000-0000-0000-0000-000000000101"),
                UUID.fromString("00000000-0000-0000-0000-000000000011"),
                "Canon imageFORMULA DR-C240",
                "CAN",
                "SN-001",
                "SCN-001",
                "CN-001",
                LocalDate.of(2024, 1, 1),
                LocalDate.of(2027, 1, 1),
                "Wartung alle 6 Monate",
                "Hauptgebäude, Raum 101",
                "Hans Müller, Tel: +49 30 123456",
                LocalDate.of(2023, 12, 15),
                "Also Holding AG",
                DeviceType.SCANNER,
                ContractType.AUTORENEWAL,
                ScannerStatus.ACTIVE,
                new BigDecimal("1500.00"),
                new BigDecimal("1800.00"),
                new BigDecimal("300.00"),
                "Test note",
                "http://example.com/scanner1.jpg",
                false
        );

        ScannerModel scannerModel2 = new ScannerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000002"),
                UUID.fromString("00000000-0000-0000-0000-000000000101"),
                UUID.fromString("00000000-0000-0000-0000-000000000011"),
                "Kodak i2900 Scanner",
                "KOD",
                "SN-002",
                "SCN-002",
                "CN-002",
                LocalDate.of(2024, 2, 1),
                LocalDate.of(2027, 2, 1),
                "Wartung alle 4 Monate",
                "Nebengebäude, Etage 2",
                "Eva Schmidt, Tel: +49 89 987654",
                LocalDate.of(2024, 1, 20),
                "Computacenter AG",
                DeviceType.SCANNER,
                ContractType.AUTORENEWAL,
                ScannerStatus.ACTIVE,
                new BigDecimal("1600.00"),
                new BigDecimal("1900.00"),
                new BigDecimal("350.00"),
                "Test note 2",
                "http://example.com/scanner2.jpg",
                false
        );

        ScannerModel scannerModel3 = new ScannerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000003"),
                UUID.fromString("00000000-0000-0000-0000-000000000101"),
                UUID.fromString("00000000-0000-0000-0000-000000000011"),
                "Panasonic KV-S2087",
                "PAN",
                "SN-003",
                "SCN-003",
                "CN-003",
                LocalDate.of(2024, 3, 1),
                LocalDate.of(2027, 3, 1),
                "Wartung alle 6 Monate",
                "Lagergebäude, Raum 001",
                "Michael Weber, Tel: +49 30 111222",
                LocalDate.of(2024, 2, 15),
                "Also Holding AG",
                DeviceType.SCANNER,
                ContractType.FIXED_END,
                ScannerStatus.EXPIRED,
                new BigDecimal("2950.00"),
                new BigDecimal("3400.00"),
                new BigDecimal("680.00"),
                "Archived test scanner",
                "http://example.com/scanner3.jpg",
                true
        );

        servicePartnerRepository.save(servicePartnerModel1);
        customerRepository.save(customerModel1);
        scannerRepository.saveAll(List.of(scannerModel1, scannerModel2, scannerModel3));
    }

    @Test
    void testGetAllScanners() throws Exception {
        mockMvc.perform(get("/api/scanners"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].modelName").value("Canon imageFORMULA DR-C240"))
                .andExpect(jsonPath("$[1].modelName").value("Kodak i2900 Scanner"));
    }

    @Test
    void testGetAllArchivedScanners() throws Exception {
        mockMvc.perform(get("/api/scanners/archived"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void testGetScannerById() throws Exception {
        mockMvc.perform(get("/api/scanners/00000000-0000-0000-0000-000000000001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.modelName").value("Canon imageFORMULA DR-C240"))
                .andExpect(jsonPath("$.serialNumber").value("SN-001"));
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

        // Verify scanner is initially not archived
        ScannerModel scanner = scannerRepository.findById(UUID.fromString("00000000-0000-0000-0000-000000000001")).orElseThrow();
        Assertions.assertFalse(scanner.getIsArchived());

        mockMvc.perform(MockMvcRequestBuilders.put("/api/scanners/00000000-0000-0000-0000-000000000001/archive"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("00000000-0000-0000-0000-000000000001"))
                .andExpect(jsonPath("$.modelName").value("Canon imageFORMULA DR-C240"))
                .andExpect(jsonPath("$.isArchived").value(true));

        // Verify scanner is now archived in database
        ScannerModel updatedScanner = scannerRepository.findById(UUID.fromString("00000000-0000-0000-0000-000000000001")).orElseThrow();
        Assertions.assertTrue(updatedScanner.getIsArchived());
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

        // Use archived scanner (scannerModel3)
        mockMvc.perform(MockMvcRequestBuilders.put("/api/scanners/00000000-0000-0000-0000-000000000003/archive"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("00000000-0000-0000-0000-000000000003"))
                .andExpect(jsonPath("$.modelName").value("Panasonic KV-S2087"))
                .andExpect(jsonPath("$.isArchived").value(false));

        // Verify scanner is now active in database
        ScannerModel updatedScanner = scannerRepository.findById(UUID.fromString("00000000-0000-0000-0000-000000000003")).orElseThrow();
        Assertions.assertFalse(updatedScanner.getIsArchived());
    }

    @Test
    void testToggleArchiveStatus_shouldReturnForbiddenWhenNotAuthenticated() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.put("/api/scanners/00000000-0000-0000-0000-000000000001/archive"))
                .andExpect(status().isForbidden());
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
              "modelName": "Canon imageFORMULA DR-C225W",
              "manufacturerCode": "CAN",
              "serialNumber": "SN-003",
              "scannerNrNavision": "SCN-003",
              "contractNumber": "CN-003",
              "deviceType": "SCANNER",
              "contractType": "AUTORENEWAL",
              "status": "ACTIVE",
              "startDate": "2024-03-01",
              "endDate": "2027-03-01",
              "slaMaintenance": "Wartung alle 6 Monate",
              "locationAddress": "Testgebäude, Raum 103",
              "contactPersonDetails": "Klaus Test, Tel: +49 30 999888",
              "acquisitionDate": "2024-02-15",
              "purchasedBy": "Cancom SE",
              "purchasePrice": 1700.00,
              "salePrice": 2000.00,
              "depreciation": 400.00,
              "notes": "Test note 3"
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
              "modelName": "Canon imageFORMULA DR-C225W",
              "manufacturerCode": "CAN",
              "serialNumber": "SN-003",
              "scannerNrNavision": "SCN-003",
              "contractNumber": "CN-003",
              "deviceType": "SCANNER",
              "contractType": "AUTORENEWAL",
              "status": "ACTIVE",
              "startDate": "2024-03-01",
              "endDate": "2027-03-01",
              "slaMaintenance": "Wartung alle 6 Monate",
              "locationAddress": "Testgebäude, Raum 103",
              "contactPersonDetails": "Klaus Test, Tel: +49 30 999888",
              "acquisitionDate": "2024-02-15",
              "purchasedBy": "Cancom SE",
              "purchasePrice": 1700.00,
              "salePrice": 2000.00,
              "depreciation": 400.00,
              "notes": "Test note 3"
            }
           """.getBytes())))
                .andExpect(status().isForbidden());

        List<ScannerModel> scanners = scannerRepository.findAll();
        Assertions.assertEquals(3, scanners.size());
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
                "azure"
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
                     "modelName": "Canon imageFORMULA DR-G2140 Updated",
                     "manufacturerCode": "CAN",
                     "serialNumber": "SN-003-UPD",
                     "scannerNrNavision": "SCN-003-UPD",
                     "contractNumber": "CN-003-UPD",
                     "deviceType": "SCANNER",
                     "contractType": "AUTORENEWAL",
                     "status": "ACTIVE",
                     "startDate": "2024-03-01",
                     "endDate": "2027-03-01",
                     "slaMaintenance": "Wartung alle 3 Monate, Express-Service",
                     "locationAddress": "Hauptgebäude, Raum 105 - Updated",
                     "contactPersonDetails": "Maria Fischer Updated, Tel: +49 30 123999",
                     "acquisitionDate": "2023-12-20",
                     "purchasedBy": "Dataport AöR",
                     "purchasePrice": 1700.00,
                     "salePrice": 2000.00,
                     "depreciation": 400.00,
                     "notes": "Updated test note 3",
                     "imageUrl": "https://example.com/updated-image.jpg",
                     "isArchived": false
                    }
                """.getBytes()))
                        .contentType("multipart/form-data")
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.modelName").value("Canon imageFORMULA DR-G2140 Updated"))
                .andExpect(jsonPath("$.imageUrl").value("https://example.com/updated-image.jpg"));

        ScannerModel updatedScanner = scannerRepository.findById(UUID.fromString("00000000-0000-0000-0000-000000000001")).orElseThrow();
        Assertions.assertEquals("Canon imageFORMULA DR-G2140 Updated", updatedScanner.getModelName());
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
