package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ropold.backend.exception.notfoundexceptions.AccessDeniedException;
import ropold.backend.exception.notfoundexceptions.ScannerNotFoundException;
import ropold.backend.model.ScannerModel;
import ropold.backend.service.ImageUploadUtil;
import ropold.backend.service.ScannerService;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/scanner")
@RequiredArgsConstructor
public class ScannerController {

    private final ScannerService scannerService;
    private final ImageUploadUtil imageUploadUtil;

    @GetMapping
    public List<ScannerModel> getAllScanners(){
        return scannerService.getAllScanners();
    }

    @GetMapping("/{id}")
    public ScannerModel getScannerById(@PathVariable UUID id) {
     ScannerModel scanner = scannerService.getScannerById(id);
        if (scanner == null) {
            throw new ScannerNotFoundException("Scanner not found");
        }
        return scanner;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public ScannerModel addScanner(
            @RequestPart("scannerModel") ScannerModel scannerModel,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal OAuth2User authentication) throws IOException {

        if (authentication == null) {
            throw new AccessDeniedException("User not authenticated");
        }

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = imageUploadUtil.determineImageUrl(image, null, null);
        }

        return scannerService.addScanner(
                new ScannerModel(
                        UUID.randomUUID(),
                        scannerModel.getCustomerId(),
                        scannerModel.getServicePartnerId(),
                        scannerModel.getDeviceName(),
                        scannerModel.getSerialNumber(),
                        scannerModel.getContractNumber(),
                        scannerModel.getInvoiceNumber(),
                        scannerModel.getDeviceType(),
                        scannerModel.getContractType(),
                        scannerModel.getStatus(),
                        scannerModel.getNoMaintenance(),
                        scannerModel.getStartDate(),
                        scannerModel.getEndDate(),
                        scannerModel.getPurchasePrice(),
                        scannerModel.getSalePrice(),
                        scannerModel.getDepreciation(),
                        scannerModel.getMaintenanceContent(),
                        scannerModel.getNote(),
                        imageUrl
                )
        );
    }

    @PutMapping("/{id}")
    public ScannerModel updateScanner(
            @PathVariable UUID id,
            @RequestPart("scannerModel") ScannerModel scannerModel,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal OAuth2User authentication) throws IOException {

        if (authentication == null) {
            throw new AccessDeniedException("User not authenticated");
        }

        ScannerModel existingScanner = scannerService.getScannerById(id);
        String newImageUrl = imageUploadUtil.determineImageUrl(image, scannerModel.getImageUrl(), existingScanner.getImageUrl());

        ScannerModel updatedScanner = new ScannerModel(
                existingScanner.getId(),
                scannerModel.getCustomerId(),
                scannerModel.getServicePartnerId(),
                scannerModel.getDeviceName(),
                scannerModel.getSerialNumber(),
                scannerModel.getContractNumber(),
                scannerModel.getInvoiceNumber(),
                scannerModel.getDeviceType(),
                scannerModel.getContractType(),
                scannerModel.getStatus(),
                scannerModel.getNoMaintenance(),
                scannerModel.getStartDate(),
                scannerModel.getEndDate(),
                scannerModel.getPurchasePrice(),
                scannerModel.getSalePrice(),
                scannerModel.getDepreciation(),
                scannerModel.getMaintenanceContent(),
                scannerModel.getNote(),
                newImageUrl
        );

        return scannerService.updateScanner(updatedScanner);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteScanner(@PathVariable UUID id, @AuthenticationPrincipal OAuth2User authentication) {

        if (authentication == null) {
            throw new AccessDeniedException("User not authenticated");
        }

        scannerService.deleteScanner(id);
    }


}
