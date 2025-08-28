package ropold.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ropold.backend.model.ContractType;
import ropold.backend.model.DeviceType;
import ropold.backend.model.ScannerModel;
import ropold.backend.model.ScannerStatus;
import ropold.backend.repository.ScannerRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ScannerServiceTest {

    ScannerRepository scannerRepository = mock(ScannerRepository.class);
    CloudinaryService cloudinaryService = mock(CloudinaryService.class);
    ImageUploadUtil imageUploadUtil = mock(ImageUploadUtil.class);
    ScannerService scannerService = new ScannerService(cloudinaryService, scannerRepository, imageUploadUtil);

    List<ScannerModel> scannerModels;

    @BeforeEach
    void setUp() {
        ScannerModel scannerModel1 = new ScannerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000001"),
                java.util.UUID.fromString("10000000-0000-0000-0000-000000000001"),
                java.util.UUID.fromString("20000000-0000-0000-0000-000000000001"),
                "Canon imageFORMULA DR-C240",
                "CAN",
                "SN-001",
                "SCN-001",
                "CN-001",
                java.time.LocalDate.of(2023, 1, 1),
                java.time.LocalDate.of(2025, 1, 1),
                "Wartung alle 6 Monate",
                "Hauptgebäude, Raum 101",
                "Hans Müller, Tel: +49 30 123456",
                java.time.LocalDate.of(2022, 12, 15),
                "Also Holding AG",
                DeviceType.SCANNER,
                ContractType.AUTORENEWAL,
                ScannerStatus.ACTIVE,
                new java.math.BigDecimal("1000.00"),
                new java.math.BigDecimal("1200.00"),
                new java.math.BigDecimal("200.00"),
                "Notiz 1",
                "http://example.com/scanner1.jpg",
                false
        );

        ScannerModel scannerModel2 = new ScannerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000002"),
                java.util.UUID.fromString("10000000-0000-0000-0000-000000000002"),
                java.util.UUID.fromString("20000000-0000-0000-0000-000000000002"),
                "Kodak S3120 Flatbed Scanner",
                "KOD",
                "SN-002",
                "SCN-002",
                "CN-002",
                java.time.LocalDate.of(2022, 6, 1),
                java.time.LocalDate.of(2024, 6, 1),
                "Wartung alle 12 Monate",
                "Nebengebäude, Etage 2",
                "Eva Schmidt, Tel: +49 89 987654",
                java.time.LocalDate.of(2022, 5, 10),
                "Computacenter AG",
                DeviceType.FLATBED_UNIT,
                ContractType.FIXED_END,
                ScannerStatus.EXPIRED,
                new java.math.BigDecimal("800.00"),
                new java.math.BigDecimal("950.00"),
                new java.math.BigDecimal("150.00"),
                "Notiz 2",
                "http://example.com/scanner2.jpg",
                false
        );

        scannerModels = java.util.List.of(scannerModel1, scannerModel2);
        when(scannerRepository.findAll()).thenReturn(scannerModels);
    }

    @Test
    void testGetAllScanners() {
        List<ScannerModel> result = scannerService.getAllScanners();
        assertEquals(scannerModels, result);
    }

    @Test
    void testGetScannerById() {
        ScannerModel expectedScanner = scannerModels.getFirst();
        when(scannerRepository.findById(expectedScanner.getId())).thenReturn(java.util.Optional.of(expectedScanner));
        ScannerModel result = scannerService.getScannerById(expectedScanner.getId());
        assertEquals(expectedScanner, result);
    }

    @Test
    void addScanner_ValidScanner_ReturnsSavedScanner() {
        // Given
        ScannerModel newScanner = new ScannerModel(
                UUID.fromString("00000000-0000-0000-0000-000000000003"),
                UUID.fromString("10000000-0000-0000-0000-000000000003"),
                UUID.fromString("20000000-0000-0000-0000-000000000003"),
                "Ricoh fi-7300NX",
                "RIC",
                "SN-003",
                "SCN-003",
                "CN-003",
                LocalDate.of(2023, 3, 1),
                LocalDate.of(2026, 3, 1),
                "Wartung alle 4 Monate",
                "IT-Zentrum, Büro 3.15",
                "Thomas Weber, Tel: +49 40 567890",
                LocalDate.of(2023, 2, 15),
                "Cancom SE & Co. KGaA",
                DeviceType.SCANNER,
                ContractType.FIXED_END,
                ScannerStatus.ACTIVE,
                new BigDecimal("1500.00"),
                new BigDecimal("1800.00"),
                new BigDecimal("300.00"),
                "Notiz 3",
                "http://example.com/scanner3.jpg",
                false
        );

        when(scannerRepository.save(newScanner)).thenReturn(newScanner);

        // When
        ScannerModel result = scannerService.addScanner(newScanner);

        // Then
        assertEquals(newScanner, result);
        verify(scannerRepository, times(1)).save(newScanner);
    }

    @Test
    void testUpdateScanner(){
        ScannerModel existingScanner = scannerModels.getFirst();
        ScannerModel updatedScanner = new ScannerModel(
                existingScanner.getId(),
                existingScanner.getCustomerId(),
                existingScanner.getServicePartnerId(),
                "Canon imageFORMULA DR-G2140",
                "CAN",
                "SN-001-UPDATED",
                "SCN-001-UPD",
                "CN-001-UPDATED",
                LocalDate.of(2023, 1, 1),
                LocalDate.of(2025, 1, 1),
                "Wartung alle 3 Monate, Express-Service",
                "Hauptgebäude, Raum 105 - Aktualisiert",
                "Maria Fischer, Tel: +49 30 123999",
                LocalDate.of(2022, 12, 20),
                "Dataport AöR",
                DeviceType.FLATBED_UNIT,
                ContractType.AUTORENEWAL,
                ScannerStatus.ACTIVE,
                new BigDecimal("1100.00"),
                new BigDecimal("1300.00"),
                new BigDecimal("250.00"),
                "Updated Notiz 1",
                "http://example.com/updated_scanner1.jpg",
                existingScanner.getIsArchived()
        );

        when(scannerRepository.findById(existingScanner.getId())).thenReturn(java.util.Optional.of(existingScanner));
        when(scannerRepository.save(updatedScanner)).thenReturn(updatedScanner);

        ScannerModel result = scannerService.updateScanner(updatedScanner);
        assertEquals(updatedScanner, result);
        verify(scannerRepository).save(updatedScanner);
        verify(imageUploadUtil).cleanupOldImageIfNeeded(existingScanner.getImageUrl(), updatedScanner.getImageUrl());
    }

    @Test
    void testDeleteScanner(){
        ScannerModel existingScanner = scannerModels.getFirst();
        when(scannerRepository.findById(existingScanner.getId())).thenReturn(java.util.Optional.of(existingScanner));
        scannerService.deleteScanner(existingScanner.getId());
        verify(scannerRepository).deleteById(existingScanner.getId());
        verify(cloudinaryService).deleteImage(existingScanner.getImageUrl());
    }
}
