package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.exception.notfoundexceptions.CustomerNotFoundException;
import ropold.backend.model.CustomerModel;
import ropold.backend.repository.CustomerRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final IdService idService;
    private final CloudinaryService cloudinaryService;
    private final CustomerRepository customerRepository;

    public List<CustomerModel> getAllCustomers() {
        return customerRepository.findAll();
    }

    public CustomerModel getCustomerById(UUID id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));
    }
}
