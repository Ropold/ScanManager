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
                "Scanner 1",
                "SN-001",
                "CN-001",
                "IN-001",
                DeviceType.SCANNER,
                ContractType.AUTORENEWAL,
                ScannerStatus.ACTIVE,
                false,
                java.time.LocalDate.of(2023, 1, 1),
                java.time.LocalDate.of(2025, 1, 1),
                new java.math.BigDecimal("1000.00"),
                new java.math.BigDecimal("1200.00"),
                new java.math.BigDecimal("200.00"),
                "Wartungsinhalt 1",
                "Notiz 1",
                "http://example.com/scanner1.jpg"
        );

        ScannerModel scannerModel2 = new ScannerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000002"),
                java.util.UUID.fromString("10000000-0000-0000-0000-000000000002"),
                java.util.UUID.fromString("20000000-0000-0000-0000-000000000002"),
                "Scanner 2",
                "SN-002",
                "CN-002",
                "IN-002",
                DeviceType.FLATBED_UNIT,
                ContractType.FIXED_END,
                ScannerStatus.EXPIRED,
                true,
                java.time.LocalDate.of(2022, 6, 1),
                java.time.LocalDate.of(2024, 6, 1),
                new java.math.BigDecimal("800.00"),
                new java.math.BigDecimal("950.00"),
                new java.math.BigDecimal("150.00"),
                "Wartungsinhalt 2",
                "Notiz 2",
                "http://example.com/scanner2.jpg"
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
                "Scanner 3",
                "SN-003",
                "CN-003",
                "IN-003",
                DeviceType.SCANNER,
                ContractType.FIXED_END,
                ScannerStatus.ACTIVE,
                false,
                LocalDate.of(2023, 3, 1),
                LocalDate.of(2026, 3, 1),
                new BigDecimal("1500.00"),
                new BigDecimal("1800.00"),
                new BigDecimal("300.00"),
                "Wartungsinhalt 3",
                "Notiz 3",
                "http://example.com/scanner3.jpg"
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
                "Updated Scanner 1",
                "SN-001-UPDATED",
                "CN-001-UPDATED",
                "IN-001-UPDATED",
                DeviceType.FLATBED_UNIT,
                ContractType.AUTORENEWAL,
                ScannerStatus.ACTIVE,
                false,
                LocalDate.of(2023, 1, 1),
                LocalDate.of(2025, 1, 1),
                new BigDecimal("1100.00"),
                new BigDecimal("1300.00"),
                new BigDecimal("250.00"),
                "Updated Wartungsinhalt 1",
                "Updated Notiz 1",
                "http://example.com/updated_scanner1.jpg"
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
