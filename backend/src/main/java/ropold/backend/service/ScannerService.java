package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.exception.notfoundexceptions.ScannerNotFoundException;
import ropold.backend.model.ScannerModel;
import ropold.backend.repository.ScannerRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ScannerService {

    private final CloudinaryService cloudinaryService;
    private final ScannerRepository scannerRepository;
    private final ImageUploadUtil imageUploadUtil;

    public List<ScannerModel> getAllActiveScanners() {
        return scannerRepository.findByIsArchivedFalseOrderByEndDateAsc();
    }

    public List<ScannerModel> getAllArchivedScanners() {
        return scannerRepository.findByIsArchivedTrue();
    }

    public ScannerModel getScannerById(UUID id) {
        return scannerRepository.findById(id)
                .orElseThrow(() -> new ScannerNotFoundException("Scanner not found with id: " + id));

    }

    public ScannerModel toggleArchiveStatus(UUID id) {
        ScannerModel scanner = getScannerById(id);
        scanner.setIsArchived(!scanner.getIsArchived());
        return scannerRepository.save(scanner);
    }

    public ScannerModel addScanner(ScannerModel scannerModel) {
        return scannerRepository.save(scannerModel);
    }

    public ScannerModel updateScanner(ScannerModel updatedScanner) {
        ScannerModel existingScanner = getScannerById(updatedScanner.getId());

        // Cleanup mit ImageUploadUtil
        imageUploadUtil.cleanupOldImageIfNeeded(
                existingScanner.getImageUrl(),
                updatedScanner.getImageUrl()
        );

        return scannerRepository.save(updatedScanner);
    }

    public void deleteScanner(UUID id) {
        ScannerModel scannerModel = scannerRepository.findById(id)
                .orElseThrow(() -> new ScannerNotFoundException("Scanner not found with id: " + id));

        if (scannerModel.getImageUrl() != null) {
            cloudinaryService.deleteImage(scannerModel.getImageUrl());
        }

        scannerRepository.deleteById(id);
    }
}
