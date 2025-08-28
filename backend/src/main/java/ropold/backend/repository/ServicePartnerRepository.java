package ropold.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ropold.backend.model.ServicePartnerModel;

import java.util.List;
import java.util.UUID;

public interface ServicePartnerRepository extends JpaRepository<ServicePartnerModel, UUID> {
    List<ServicePartnerModel> findByIsArchivedFalse();
    List<ServicePartnerModel> findByIsArchivedTrue();
}
