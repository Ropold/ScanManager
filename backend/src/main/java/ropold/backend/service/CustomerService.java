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

    private final CloudinaryService cloudinaryService;
    private final CustomerRepository customerRepository;

    public List<CustomerModel> getAllCustomers() {
        return customerRepository.findAll();
    }

    public CustomerModel getCustomerById(UUID id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));
    }

    public CustomerModel addCustomer(CustomerModel customerModel) {
        return customerRepository.save(customerModel);
    }

    public CustomerModel updateCustomer(CustomerModel updatedCustomer) {
        CustomerModel existingCustomer = getCustomerById(updatedCustomer.getId());

        boolean oldHadImage = existingCustomer.getImageUrl() != null && !existingCustomer.getImageUrl().isBlank();
        boolean nowNoImage = updatedCustomer.getImageUrl() == null || updatedCustomer.getImageUrl().isBlank();
        boolean imageWasReplaced = oldHadImage && !existingCustomer.getImageUrl().equals(updatedCustomer.getImageUrl());

        if (oldHadImage && (nowNoImage || imageWasReplaced)) {
            cloudinaryService.deleteImage(existingCustomer.getImageUrl());
        }

        return customerRepository.save(updatedCustomer);
    }

    public void deleteCustomer(UUID id) {
        CustomerModel customerModel = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));

        if (customerModel.getImageUrl() != null) {
            cloudinaryService.deleteImage(customerModel.getImageUrl());
        }
        customerRepository.deleteById(id);
    }

}
