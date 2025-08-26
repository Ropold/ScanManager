package ropold.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ropold.backend.model.ServicePartnerModel;
import ropold.backend.repository.ServicePartnerRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ServicePartnerServiceTest {

    ServicePartnerRepository servicePartnerRepository = mock(ServicePartnerRepository.class);
    CloudinaryService cloudinaryService = mock(CloudinaryService.class);
    ImageUploadUtil imageUploadUtil = mock(ImageUploadUtil.class);
    ServicePartnerService servicePartnerService = new ServicePartnerService(cloudinaryService, servicePartnerRepository, imageUploadUtil);

    List<ServicePartnerModel> servicePartnerModels;

    @BeforeEach
    void setUp() {
        ServicePartnerModel servicePartnerModel1 = new ServicePartnerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000001"),
                "Service Partner 1",
                "Contact Person 1",
                "Notes 1",
                "http://example.com/partner1.jpg"
        );
        ServicePartnerModel servicePartnerModel2 = new ServicePartnerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000002"),
                "Service Partner 2",
                "Contact Person 2",
                "Notes 2",
                "http://example.com/partner2.jpg"
        );
        servicePartnerModels = List.of(servicePartnerModel1, servicePartnerModel2);
        when(servicePartnerRepository.findAll()).thenReturn(servicePartnerModels);
    }

    @Test
    void testGetAllServicePartners() {
        List<ServicePartnerModel> result = servicePartnerService.getAllServicePartners();
        assertEquals(servicePartnerModels, result);
    }

    @Test
    void testGetServicePartnerById() {
        ServicePartnerModel expectedPartner = servicePartnerModels.getFirst();
        when(servicePartnerRepository.findById(expectedPartner.getId())).thenReturn(java.util.Optional.of(expectedPartner));
        ServicePartnerModel result = servicePartnerService.getServicePartnerById(expectedPartner.getId());
        assertEquals(expectedPartner, result);
    }

    @Test
    void testAddServicePartner() {
        ServicePartnerModel newPartner = new ServicePartnerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000003"),
                "Service Partner 3",
                "Contact Person 3",
                "Notes 3",
                "http://example.com/partner3.jpg"
        );
        when(servicePartnerRepository.save(newPartner)).thenReturn(newPartner);
        ServicePartnerModel result = servicePartnerService.addServicePartner(newPartner);
        assertEquals(newPartner, result);
    }

    @Test
    void testUpdateServicePartner() {
        ServicePartnerModel existingPartner = servicePartnerModels.getFirst();
        ServicePartnerModel updatedPartner = new ServicePartnerModel(
                existingPartner.getId(),
                "Updated Service Partner 1",
                "Updated Contact Person 1",
                "Updated Notes 1",
                "http://example.com/updated_partner1.jpg"
        );

        when(servicePartnerRepository.findById(existingPartner.getId())).thenReturn(java.util.Optional.of(existingPartner));
        when(servicePartnerRepository.save(updatedPartner)).thenReturn(updatedPartner);

        ServicePartnerModel result = servicePartnerService.updateServicePartner(updatedPartner);
        assertEquals(updatedPartner, result);
        verify(imageUploadUtil, times(1)).cleanupOldImageIfNeeded(existingPartner.getImageUrl(), updatedPartner.getImageUrl());
    }

    @Test
    void testDeleteServicePartner() {
        ServicePartnerModel servicePartnerModel = servicePartnerModels.getFirst();
        when(servicePartnerRepository.findById(servicePartnerModel.getId())).thenReturn(java.util.Optional.of(servicePartnerModel));
        servicePartnerService.deleteServicePartner(servicePartnerModel.getId());
        verify(servicePartnerRepository, times(1)).deleteById(servicePartnerModel.getId());
        verify(cloudinaryService, times(1)).deleteImage(servicePartnerModel.getImageUrl());
    }

}
