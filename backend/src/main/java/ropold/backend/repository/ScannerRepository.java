package ropold.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ropold.backend.model.ScannerModel;

import java.util.List;
import java.util.UUID;

public interface ScannerRepository extends JpaRepository<ScannerModel, UUID> {
    List<ScannerModel> findByIsArchivedFalseOrderByEndDateAsc();
    List<ScannerModel> findByIsArchivedTrue();
}
