package ropold.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ropold.backend.model.ScannerModel;

import java.util.UUID;

public interface ScannerRepository extends JpaRepository<ScannerModel, UUID> {
}
