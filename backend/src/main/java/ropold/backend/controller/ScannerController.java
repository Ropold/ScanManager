package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ropold.backend.exception.notfoundexceptions.CustomerNotFoundException;
import ropold.backend.exception.notfoundexceptions.ScannerNotFoundException;
import ropold.backend.model.ScannerModel;
import ropold.backend.service.ScannerService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/scanners")
@RequiredArgsConstructor
public class ScannerController {

    private final ScannerService scannerService;

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

}
