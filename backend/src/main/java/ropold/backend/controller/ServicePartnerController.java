package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ropold.backend.exception.notfoundexceptions.AccessDeniedException;
import ropold.backend.exception.notfoundexceptions.ServicePartnerNotFoundException;
import ropold.backend.model.ServicePartnerModel;
import ropold.backend.service.CloudinaryService;
import ropold.backend.service.ImageUploadUtil;
import ropold.backend.service.ServicePartnerService;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/service-partners")
@RequiredArgsConstructor
public class ServicePartnerController {

    private final ServicePartnerService servicePartnerService;
    private final CloudinaryService cloudinaryService;
    private final ImageUploadUtil imageUploadUtil;

    @GetMapping
    public List<ServicePartnerModel> getAllActiveServicePartners() {
        return servicePartnerService.getAllActiveServicePartners();
    }

    @GetMapping("/archive")
    public List<ServicePartnerModel> getAllArchivedServicePartners() {
        return servicePartnerService.getAllArchivedServicePartners();
    }

    @GetMapping("{id}")
    public ServicePartnerModel getServicePartner(@PathVariable UUID id) {
        ServicePartnerModel servicePartner = servicePartnerService.getServicePartnerById(id);
        if (servicePartner == null) {
            throw new ServicePartnerNotFoundException("Service Partner not found with id: " + id);
        }
        return servicePartner;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public ServicePartnerModel addServicePartner(
            @RequestPart("servicePartnerModel") ServicePartnerModel servicePartnerModel,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal OAuth2User authentication) throws IOException {

        if (authentication == null) {
            throw new AccessDeniedException("User not authenticated");
        }

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.uploadImage(image);
        }

        return servicePartnerService.addServicePartner(
                new ServicePartnerModel(
                        UUID.randomUUID(),
                        servicePartnerModel.getCreditorNrNavision(),
                        servicePartnerModel.getName(),
                        servicePartnerModel.getContactPerson(),
                        servicePartnerModel.getContactDetails(),
                        servicePartnerModel.getNotes(),
                        imageUrl,
                        false
                )
        );
    }

    @PutMapping("/{id}")
    public ServicePartnerModel updateServicePartner(
            @PathVariable UUID id,
            @RequestPart("servicePartnerModel") ServicePartnerModel servicePartnerModel,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal OAuth2User authentication) throws IOException {

        if (authentication == null) {
            throw new AccessDeniedException("User not authenticated");
        }

        ServicePartnerModel existingServicePartner = servicePartnerService.getServicePartnerById(id);
        String newImageUrl = imageUploadUtil.determineImageUrl(image, servicePartnerModel.getImageUrl(), existingServicePartner.getImageUrl());

        ServicePartnerModel updatedServicePartner = new ServicePartnerModel(
                existingServicePartner.getId(),
                servicePartnerModel.getCreditorNrNavision(),
                servicePartnerModel.getName(),
                servicePartnerModel.getContactPerson(),
                servicePartnerModel.getContactDetails(),
                servicePartnerModel.getNotes(),
                newImageUrl,
                existingServicePartner.getIsArchived()
        );

        return servicePartnerService.updateServicePartner(updatedServicePartner);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteServicePartner(@PathVariable UUID id, @AuthenticationPrincipal OAuth2User authentication) {

        if (authentication == null) {
            throw new AccessDeniedException("User not authenticated");
        }

        servicePartnerService.deleteServicePartner(id);
    }
}
