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
@RequestMapping("/api/scanners")
@RequiredArgsConstructor
public class ScannerController {

    private final ScannerService scannerService;
    private final ImageUploadUtil imageUploadUtil;

    @GetMapping
    public List<ScannerModel> getAllActiveScanners(){
        return scannerService.getAllActiveScanners();
    }

    @GetMapping("/archived")
    public List<ScannerModel> getAllArchivedScanners(){
        return scannerService.getAllArchivedScanners();
    }

    @GetMapping("/{id}")
    public ScannerModel getScannerById(@PathVariable UUID id) {
     ScannerModel scanner = scannerService.getScannerById(id);
        if (scanner == null) {
            throw new ScannerNotFoundException("Scanner not found");
        }
        return scanner;
    }

    @PutMapping("/{id}/archive")
    public ScannerModel toggleArchiveStatus(@PathVariable UUID id, @AuthenticationPrincipal OAuth2User authentication){
        if(authentication == null){
            throw new AccessDeniedException("User not authenticated");
        }
        return scannerService.toggleArchiveStatus(id);
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

        // Erstelle neues Scanner-Objekt ohne manuelle ID-Setzung
        ScannerModel newScanner = new ScannerModel();
        newScanner.setCustomer(scannerModel.getCustomer());
        newScanner.setServicePartner(scannerModel.getServicePartner());
        newScanner.setModelName(scannerModel.getModelName());
        newScanner.setManufacturerCode(scannerModel.getManufacturerCode());
        newScanner.setSerialNumber(scannerModel.getSerialNumber());
        newScanner.setScannerNrNavision(scannerModel.getScannerNrNavision());
        newScanner.setContractNumber(scannerModel.getContractNumber());
        newScanner.setStartDate(scannerModel.getStartDate());
        newScanner.setEndDate(scannerModel.getEndDate());
        newScanner.setSlaMaintenance(scannerModel.getSlaMaintenance());
        newScanner.setLocationAddress(scannerModel.getLocationAddress());
        newScanner.setContactPersonDetails(scannerModel.getContactPersonDetails());
        newScanner.setAcquisitionDate(scannerModel.getAcquisitionDate());
        newScanner.setPurchasedBy(scannerModel.getPurchasedBy());
        newScanner.setDeviceType(scannerModel.getDeviceType());
        newScanner.setContractType(scannerModel.getContractType());
        newScanner.setStatus(scannerModel.getStatus());
        newScanner.setPurchasePrice(scannerModel.getPurchasePrice());
        newScanner.setSalePrice(scannerModel.getSalePrice());
        newScanner.setDepreciation(scannerModel.getDepreciation());
        newScanner.setNotes(scannerModel.getNotes());
        newScanner.setImageUrl(imageUrl);
        newScanner.setIsArchived(false);

        return scannerService.addScanner(newScanner);
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

        // Update existierender Scanner
        existingScanner.setCustomer(scannerModel.getCustomer());
        existingScanner.setServicePartner(scannerModel.getServicePartner());
        existingScanner.setModelName(scannerModel.getModelName());
        existingScanner.setManufacturerCode(scannerModel.getManufacturerCode());
        existingScanner.setSerialNumber(scannerModel.getSerialNumber());
        existingScanner.setScannerNrNavision(scannerModel.getScannerNrNavision());
        existingScanner.setContractNumber(scannerModel.getContractNumber());
        existingScanner.setStartDate(scannerModel.getStartDate());
        existingScanner.setEndDate(scannerModel.getEndDate());
        existingScanner.setSlaMaintenance(scannerModel.getSlaMaintenance());
        existingScanner.setLocationAddress(scannerModel.getLocationAddress());
        existingScanner.setContactPersonDetails(scannerModel.getContactPersonDetails());
        existingScanner.setAcquisitionDate(scannerModel.getAcquisitionDate());
        existingScanner.setPurchasedBy(scannerModel.getPurchasedBy());
        existingScanner.setDeviceType(scannerModel.getDeviceType());
        existingScanner.setContractType(scannerModel.getContractType());
        existingScanner.setStatus(scannerModel.getStatus());
        existingScanner.setPurchasePrice(scannerModel.getPurchasePrice());
        existingScanner.setSalePrice(scannerModel.getSalePrice());
        existingScanner.setDepreciation(scannerModel.getDepreciation());
        existingScanner.setNotes(scannerModel.getNotes());
        existingScanner.setImageUrl(newImageUrl);
        existingScanner.setIsArchived(scannerModel.getIsArchived());

        return scannerService.updateScanner(existingScanner);
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
