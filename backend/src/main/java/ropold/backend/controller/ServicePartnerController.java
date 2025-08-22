package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ropold.backend.exception.notfoundexceptions.ServicePartnerNotFoundException;
import ropold.backend.model.ServicePartnerModel;
import ropold.backend.service.ServicePartnerService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/service-partner")
@RequiredArgsConstructor
public class ServicePartnerController {

    private final ServicePartnerService servicePartnerService;

    @GetMapping
    public List<ServicePartnerModel> getServicePartners() {
        return servicePartnerService.getAllServicePartners();
    }

    @GetMapping("{id}")
    public ServicePartnerModel getServicePartner(@PathVariable UUID id) {
        ServicePartnerModel servicePartner = servicePartnerService.getServicePartnerById(id);
        if (servicePartner == null) {
            throw new ServicePartnerNotFoundException("Service Partner not found with id: " + id);
        }
        return servicePartner;
    }
}
