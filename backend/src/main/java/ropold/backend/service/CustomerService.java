package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.repository.CustomerRepository;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final IdService idService;
    private final CloudinaryService cloudinaryService;
    private final CustomerRepository customerRepository;

}
