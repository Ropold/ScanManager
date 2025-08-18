package ropold.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ropold.backend.model.ServicePartnerModel;

import java.util.UUID;

public interface ServicePartnerRepository extends JpaRepository<ServicePartnerModel, UUID> {
}
