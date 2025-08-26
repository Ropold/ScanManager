package ropold.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ropold.backend.model.CustomerModel;
import ropold.backend.repository.CustomerRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class CustomerServiceTest {

    CustomerRepository customerRepository = mock(CustomerRepository.class);
    CloudinaryService cloudinaryService = mock(CloudinaryService.class);
    ImageUploadUtil imageUploadUtil = mock(ImageUploadUtil.class);
    CustomerService customerService = new CustomerService(cloudinaryService, customerRepository, imageUploadUtil);

    List<CustomerModel> customerModels;


    @BeforeEach
    void setUp() {

        CustomerModel customerModel1 = new CustomerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000001"),
                "Max Mustermann",
                "Contact Person1",
                "Notes1",
                "http://example.com/customer1.jpg"
        );

        CustomerModel customerModel2 = new CustomerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000002"),
                "Erika Musterfrau",
                "Contact Person2",
                "Notes2",
                "http://example.com/customer2.jpg"
        );

        customerModels = List.of(customerModel1, customerModel2);
        when(customerRepository.findAll()).thenReturn(customerModels);
    }

    @Test
    void testGetAllCustomers() {
        List<CustomerModel> result = customerService.getAllCustomers();
        assertEquals(customerModels, result);
    }

    @Test
    void testGetCustomerById() {
        CustomerModel expectedCustomer = customerModels.getFirst();
        when(customerRepository.findById(expectedCustomer.getId())).thenReturn(java.util.Optional.of(expectedCustomer));
        CustomerModel result = customerService.getCustomerById(expectedCustomer.getId());
        assertEquals(expectedCustomer, result);
    }

    @Test
    void testAddCustomer() {

        CustomerModel customerModel3 = new CustomerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000003"),
                "Hans Beispiel",
                "Contact Person3",
                "Notes3",
                "http://example.com/customer3.jpg"
        );
        when(customerRepository.save(customerModel3)).thenReturn(customerModel3);
        CustomerModel expected = customerService.addCustomer(customerModel3);
        assertEquals(customerModel3, expected);
        verify(customerRepository, times(1)).save(customerModel3);
    }

    @Test
    void testUpdateCustomer() {
        CustomerModel updatedCustomer = new CustomerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000001"),
                "Max Mustermann",
                "New Contact Person1",
                "New Notes1",
                "http://example.com/customer1.jpg"
        );

        when(customerRepository.findById(updatedCustomer.getId())).thenReturn(java.util.Optional.of(customerModels.getFirst()));
        when(customerRepository.save(updatedCustomer)).thenReturn(updatedCustomer);

        CustomerModel result = customerService.updateCustomer(updatedCustomer);
        assertEquals(updatedCustomer, result);
    }

    @Test
    void testDeleteCustomer() {
        CustomerModel customerModel = customerModels.getFirst();
        when(customerRepository.findById(customerModel.getId())).thenReturn(java.util.Optional.of(customerModel));
        customerService.deleteCustomer(java.util.UUID.fromString("00000000-0000-0000-0000-000000000001"));
        verify(customerRepository, times(1)).deleteById(customerModel.getId());
        verify(cloudinaryService, times(1)).deleteImage(customerModel.getImageUrl());
    }

}
