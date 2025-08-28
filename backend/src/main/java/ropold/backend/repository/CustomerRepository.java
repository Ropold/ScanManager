package ropold.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ropold.backend.model.CustomerModel;

import java.util.List;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<CustomerModel, UUID> {
    List<CustomerModel> findByIsArchivedFalse();
    List<CustomerModel> findByIsArchivedTrue();
}
