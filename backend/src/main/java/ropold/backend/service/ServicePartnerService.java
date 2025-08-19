package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.exception.notfoundexceptions.ServicePartnerNotFoundException;
import ropold.backend.model.ServicePartnerModel;
import ropold.backend.repository.ServicePartnerRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ServicePartnerService {

    private final CloudinaryService cloudinaryService;
    private final ServicePartnerRepository servicePartnerRepository;

    public List<ServicePartnerModel> getAllServicePartners() {
        return servicePartnerRepository.findAll();
    }

    public ServicePartnerModel getServicePartnerById(UUID id) {
        return servicePartnerRepository.findById(id)
                .orElseThrow(() -> new ServicePartnerNotFoundException("Service Partner not found with id: " + id));
    }

}
