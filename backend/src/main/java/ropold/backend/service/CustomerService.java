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
    private final ImageUploadUtil imageUploadUtil;

    public List<CustomerModel> getAllActiveCustomers() {
        return customerRepository.findByIsArchivedFalseOrderByNameAsc();
    }

    public List<CustomerModel> getAllArchivedCustomers() {
        return customerRepository.findByIsArchivedTrue();
    }

    public CustomerModel getCustomerById(UUID id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));
    }

    public CustomerModel toggleArchiveStatus(UUID id) {
        CustomerModel customer = getCustomerById(id);
        customer.setIsArchived(!customer.getIsArchived());
        return customerRepository.save(customer);
    }

    public CustomerModel addCustomer(CustomerModel customerModel) {
        return customerRepository.save(customerModel);
    }

    public CustomerModel updateCustomer(CustomerModel updatedCustomer) {
        CustomerModel existingCustomer = getCustomerById(updatedCustomer.getId());

        // Cleanup mit ImageUploadUtil
        imageUploadUtil.cleanupOldImageIfNeeded(
                existingCustomer.getImageUrl(),
                updatedCustomer.getImageUrl()
        );

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
