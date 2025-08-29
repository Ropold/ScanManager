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
    private final ImageUploadUtil imageUploadUtil;

    public List<ServicePartnerModel> getAllActiveServicePartners() {
        return servicePartnerRepository.findByIsArchivedFalseOrderByNameAsc();
    }

    public List<ServicePartnerModel> getAllArchivedServicePartners() {
        return servicePartnerRepository.findByIsArchivedTrue();
    }

    public ServicePartnerModel getServicePartnerById(UUID id) {
        return servicePartnerRepository.findById(id)
                .orElseThrow(() -> new ServicePartnerNotFoundException("Service Partner not found with id: " + id));
    }

    public ServicePartnerModel addServicePartner(ServicePartnerModel servicePartnerModel) {
        return servicePartnerRepository.save(servicePartnerModel);
    }

    public ServicePartnerModel updateServicePartner(ServicePartnerModel updatedServicePartner) {
        ServicePartnerModel servicePartnerModel = getServicePartnerById(updatedServicePartner.getId());

        // Cleanup mit ImageUploadUtil
        imageUploadUtil.cleanupOldImageIfNeeded(
                servicePartnerModel.getImageUrl(),
                updatedServicePartner.getImageUrl()
        );

        return servicePartnerRepository.save(updatedServicePartner);
    }

    public void deleteServicePartner(UUID id) {
        ServicePartnerModel servicePartnerModel = servicePartnerRepository.findById(id)
                .orElseThrow(() -> new ServicePartnerNotFoundException("Service Partner not found with id: " + id));

        if (servicePartnerModel.getImageUrl() != null) {
            cloudinaryService.deleteImage(servicePartnerModel.getImageUrl());
        }
        servicePartnerRepository.deleteById(id);
    }
}
