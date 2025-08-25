package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ropold.backend.exception.notfoundexceptions.CustomerNotFoundException;
import ropold.backend.model.CustomerModel;
import ropold.backend.service.CloudinaryService;
import ropold.backend.service.CustomerService;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    public List<CustomerModel> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public CustomerModel getCustomerById(@PathVariable UUID id) {
        CustomerModel customer = customerService.getCustomerById(id);
        if (customer == null) {
            throw new CustomerNotFoundException("No Customer found with id: " + id);
        }
        return customer;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public CustomerModel addCustomer(
            @RequestPart("customerModel") CustomerModel customerModel,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal OAuth2User authentication) throws IOException {

        if (authentication == null) {
            throw new AccessDeniedException("User not authenticated");
        }

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.uploadImage(image);
        }

        return customerService.addCustomer(
                new CustomerModel(
                        UUID.randomUUID(),
                        customerModel.getName(),
                        customerModel.getContactPerson(),
                        customerModel.getNotes(),
                        imageUrl
                )
        );
    }

    @PutMapping("/{id}")
    public CustomerModel updateCustomer(
            @PathVariable UUID id,
            @RequestPart("customerModel") CustomerModel customerModel,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal OAuth2User authentication) throws IOException {

        if (authentication == null) {
            throw new AccessDeniedException("User not authenticated");
        }

        CustomerModel existingCustomer = customerService.getCustomerById(id);
        String newImageUrl;
        if (image != null && !image.isEmpty()) {
            newImageUrl = cloudinaryService.uploadImage(image);
        } else if (customerModel.getImageUrl() == null || customerModel.getImageUrl().isBlank()) {
            newImageUrl = null;
        } else {
            newImageUrl = existingCustomer.getImageUrl();
        }

        CustomerModel updatedCustomer = new CustomerModel(
                existingCustomer.getId(),
                customerModel.getName(),
                customerModel.getContactPerson(),
                customerModel.getNotes(),
                newImageUrl
        );

        return customerService.updateCustomer(updatedCustomer);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCustomer(@PathVariable UUID id, @AuthenticationPrincipal OAuth2User authentication){

        if (authentication == null) {
            throw new AccessDeniedException("User not authenticated");
        }

        customerService.deleteCustomer(id);
    }

}
