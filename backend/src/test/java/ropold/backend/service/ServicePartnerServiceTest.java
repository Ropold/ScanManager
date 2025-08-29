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

    List<ServicePartnerModel> activeServicePartners;
    List<ServicePartnerModel> archivedServicePartners;

    @BeforeEach
    void setUp() {
        ServicePartnerModel servicePartnerModel1 = new ServicePartnerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000001"),
                "KRED-3001",
                "Canon Deutschland GmbH",
                "Contact Person 1",
                "Europark Fichtenhain A10, 47807 Krefeld, Tel: +49 2151 345-0, Email: service@canon.de",
                "Notes 1",
                "http://example.com/partner1.jpg",
                false
        );
        ServicePartnerModel servicePartnerModel2 = new ServicePartnerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000002"),
                "KRED-3002",
                "Kodak Alaris Germany GmbH",
                "Contact Person 2",
                "Hemshofstraße 14E, 68163 Mannheim, Tel: +49 621 43001-0, Email: support@kodakalaris.com",
                "Notes 2",
                "http://example.com/partner2.jpg",
                false
        );

        ServicePartnerModel servicePartnerModel3 = new ServicePartnerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000003"),
                "KRED-3003",
                "Ricoh Deutschland GmbH",
                "Contact Person 3",
                "Vahrenwalder Straße 315, 30179 Hannover, Tel: +49 511 6742-0, Email: service@ricoh.de",
                "Archivierter Service-Partner - Vertrag beendet",
                "http://example.com/partner3.jpg",
                true
        );
        activeServicePartners = List.of(servicePartnerModel1, servicePartnerModel2);
        archivedServicePartners = List.of(servicePartnerModel3);
        when(servicePartnerRepository.findByIsArchivedFalseOrderByNameAsc()).thenReturn(activeServicePartners);
        when(servicePartnerRepository.findByIsArchivedTrue()).thenReturn(archivedServicePartners);
    }

    @Test
    void testGetAllServicePartners() {
        List<ServicePartnerModel> result = servicePartnerService.getAllActiveServicePartners();
        assertEquals(activeServicePartners, result);
    }

    @Test
    void testGetAllArchivedServicePartners() {
        List<ServicePartnerModel> result = servicePartnerService.getAllArchivedServicePartners();
        assertEquals(archivedServicePartners, result);
    }

    @Test
    void testGetServicePartnerById() {
        ServicePartnerModel expectedPartner = activeServicePartners.getFirst();
        when(servicePartnerRepository.findById(expectedPartner.getId())).thenReturn(java.util.Optional.of(expectedPartner));
        ServicePartnerModel result = servicePartnerService.getServicePartnerById(expectedPartner.getId());
        assertEquals(expectedPartner, result);
    }

    @Test
    void testAddServicePartner() {
        ServicePartnerModel newPartner = new ServicePartnerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000003"),
                "KRED-3003",
                "Ricoh Deutschland GmbH",
                "Contact Person 3",
                "Vahrenwalder Straße 315, 30179 Hannover, Tel: +49 511 6742-0, Email: service@ricoh.de",
                "Notes 3",
                "http://example.com/partner3.jpg",
                false
        );
        when(servicePartnerRepository.save(newPartner)).thenReturn(newPartner);
        ServicePartnerModel result = servicePartnerService.addServicePartner(newPartner);
        assertEquals(newPartner, result);
    }

    @Test
    void testUpdateServicePartner() {
        ServicePartnerModel existingPartner = activeServicePartners.getFirst();
        ServicePartnerModel updatedPartner = new ServicePartnerModel(
                existingPartner.getId(),
                existingPartner.getCreditorNrNavision(),
                "Canon Europe B.V.",
                "Updated Contact Person 1",
                "Bovenkerkerweg 59, 1185 XB Amstelveen, Netherlands, Tel: +31 20 545-8545, Email: support@canon.eu",
                "Updated Notes 1",
                "http://example.com/updated_partner1.jpg",
                existingPartner.getIsArchived()
        );

        when(servicePartnerRepository.findById(existingPartner.getId())).thenReturn(java.util.Optional.of(existingPartner));
        when(servicePartnerRepository.save(updatedPartner)).thenReturn(updatedPartner);

        ServicePartnerModel result = servicePartnerService.updateServicePartner(updatedPartner);
        assertEquals(updatedPartner, result);
        verify(imageUploadUtil, times(1)).cleanupOldImageIfNeeded(existingPartner.getImageUrl(), updatedPartner.getImageUrl());
    }

    @Test
    void testDeleteServicePartner() {
        ServicePartnerModel servicePartnerModel = activeServicePartners.getFirst();
        when(servicePartnerRepository.findById(servicePartnerModel.getId())).thenReturn(java.util.Optional.of(servicePartnerModel));
        servicePartnerService.deleteServicePartner(servicePartnerModel.getId());
        verify(servicePartnerRepository, times(1)).deleteById(servicePartnerModel.getId());
        verify(cloudinaryService, times(1)).deleteImage(servicePartnerModel.getImageUrl());
    }

}
