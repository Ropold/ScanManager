package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ropold.backend.exception.notfoundexceptions.CustomerNotFoundException;
import ropold.backend.model.CustomerModel;
import ropold.backend.service.CustomerService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

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
}
