package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.repository.ScannerRepository;

@Service
@RequiredArgsConstructor
public class ScannerService {

    private final IdService idService;
    private final CloudinaryService cloudinaryService;
    private final ScannerRepository scannerRepository;

}
