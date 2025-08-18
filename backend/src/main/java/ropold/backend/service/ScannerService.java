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

    private final IdService idService;
    private final CloudinaryService cloudinaryService;
    private final ScannerRepository scannerRepository;

    public List<ScannerModel> getAllScanners() {
        return scannerRepository.findAll();
    }

    public ScannerModel getScannerById(UUID id) {
        return scannerRepository.findById(id)
                .orElseThrow(() -> new ScannerNotFoundException("Scanner not found with id: " + id));

    }
}
