package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.repository.ServicePartnerRepository;

@Service
@RequiredArgsConstructor
public class ServicePartnerService {

    private final IdService idService;
    private final CloudinaryService cloudinaryService;
    private final ServicePartnerRepository servicePartnerRepository;
}
