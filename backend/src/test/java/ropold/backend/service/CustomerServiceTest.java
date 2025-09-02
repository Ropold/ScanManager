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

    List<CustomerModel> activeCustomers;
    List<CustomerModel> archivedCustomers;

    @BeforeEach
    void setUp() {

        CustomerModel customerModel1 = new CustomerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000001"),
                "DEB-2024-001",
                "Max Mustermann",
                "Contact Person1",
                "Musterstraße 123, 12345 Berlin, Tel: +49 30 123456, Email: kontakt@mustermann.de",
                "Notes1",
                "http://example.com/customer1.jpg",
                false
        );

        CustomerModel customerModel2 = new CustomerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000002"),
                "DEB-2024-002",
                "Erika Musterfrau",
                "Contact Person2",
                "Beispielweg 45, 80331 München, Tel: +49 89 987654, Email: info@musterfrau.com",
                "Notes2",
                "http://example.com/customer2.jpg",
                false
        );

        CustomerModel customerModel3 = new CustomerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000003"),
                "DEB-2024-003",
                "Hans Beispiel",
                "Contact Person3",
                "Teststraße 78, 50667 Köln, Tel: +49 221 555123, Email: kontakt@beispiel.de",
                "Notes3",
                "http://example.com/customer3.jpg",
                true
        );

        activeCustomers = List.of(customerModel1, customerModel2);
        archivedCustomers = List.of(customerModel3);

        when(customerRepository.findByIsArchivedFalseOrderByNameAsc()).thenReturn(activeCustomers);
        when(customerRepository.findByIsArchivedTrue()).thenReturn(archivedCustomers);
    }

    @Test
    void testGetAllActiveCustomers() {
        List<CustomerModel> result = customerService.getAllActiveCustomers();
        assertEquals(activeCustomers, result);
    }

    @Test
    void testGetAllArchivedCustomers() {
        List<CustomerModel> result = customerService.getAllArchivedCustomers();
        assertEquals(archivedCustomers, result);
    }

    @Test
    void testGetCustomerById() {
        CustomerModel expectedCustomer = activeCustomers.getFirst();
        when(customerRepository.findById(expectedCustomer.getId())).thenReturn(java.util.Optional.of(expectedCustomer));
        CustomerModel result = customerService.getCustomerById(expectedCustomer.getId());
        assertEquals(expectedCustomer, result);
    }

    @Test
    void testToggleArchiveStatus_shouldToggleFromActiveToArchived() {
        // Given - Active customer
        CustomerModel activeCustomer = activeCustomers.getFirst(); // Max Mustermann (isArchived = false)
        CustomerModel toggledCustomer = new CustomerModel(
                activeCustomer.getId(),
                activeCustomer.getDebitorNrNavision(),
                activeCustomer.getName(),
                activeCustomer.getContactPerson(),
                activeCustomer.getContactDetails(),
                activeCustomer.getNotes(),
                activeCustomer.getImageUrl(),
                true // Toggled to archived
        );

        when(customerRepository.findById(activeCustomer.getId())).thenReturn(java.util.Optional.of(activeCustomer));
        when(customerRepository.save(any(CustomerModel.class))).thenReturn(toggledCustomer);

        // When
        CustomerModel result = customerService.toggleArchiveStatus(activeCustomer.getId());

        // Then
        assertEquals(true, result.getIsArchived());
        verify(customerRepository).findById(activeCustomer.getId());
        verify(customerRepository).save(argThat(customer -> customer.getIsArchived() == true));
    }

    @Test
    void testToggleArchiveStatus_shouldToggleFromArchivedToActive() {
        // Given - Archived customer
        CustomerModel archivedCustomer = archivedCustomers.getFirst(); // Hans Beispiel (isArchived = true)
        CustomerModel toggledCustomer = new CustomerModel(
                archivedCustomer.getId(),
                archivedCustomer.getDebitorNrNavision(),
                archivedCustomer.getName(),
                archivedCustomer.getContactPerson(),
                archivedCustomer.getContactDetails(),
                archivedCustomer.getNotes(),
                archivedCustomer.getImageUrl(),
                false // Toggled to active
        );

        when(customerRepository.findById(archivedCustomer.getId())).thenReturn(java.util.Optional.of(archivedCustomer));
        when(customerRepository.save(any(CustomerModel.class))).thenReturn(toggledCustomer);

        // When
        CustomerModel result = customerService.toggleArchiveStatus(archivedCustomer.getId());

        // Then
        assertEquals(false, result.getIsArchived());
        verify(customerRepository).findById(archivedCustomer.getId());
        verify(customerRepository).save(argThat(customer -> customer.getIsArchived() == false));
    }

    @Test
    void testAddCustomer() {

        CustomerModel customerModel3 = new CustomerModel(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000003"),
                "DEB-2024-003",
                "Hans Beispiel",
                "Contact Person3",
                "Teststraße 78, 50667 Köln, Tel: +49 221 555123, Email: kontakt@beispiel.de",
                "Notes3",
                "http://example.com/customer3.jpg",
                false
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
                "DEB-2024-001",
                "Max Mustermann",
                "New Contact Person1",
                "Neue Straße 456, 10115 Berlin, Tel: +49 30 777888, Email: neu@mustermann.de",
                "New Notes1",
                "http://example.com/customer1.jpg",
                false
        );

        when(customerRepository.findById(updatedCustomer.getId())).thenReturn(java.util.Optional.of(activeCustomers.getFirst()));
        when(customerRepository.save(updatedCustomer)).thenReturn(updatedCustomer);

        CustomerModel result = customerService.updateCustomer(updatedCustomer);
        assertEquals(updatedCustomer, result);
    }

    @Test
    void testDeleteCustomer() {
        CustomerModel customerModel = activeCustomers.getFirst();
        when(customerRepository.findById(customerModel.getId())).thenReturn(java.util.Optional.of(customerModel));
        customerService.deleteCustomer(java.util.UUID.fromString("00000000-0000-0000-0000-000000000001"));
        verify(customerRepository, times(1)).deleteById(customerModel.getId());
        verify(cloudinaryService, times(1)).deleteImage(customerModel.getImageUrl());
    }

}
