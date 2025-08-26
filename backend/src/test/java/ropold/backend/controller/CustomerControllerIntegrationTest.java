package ropold.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ropold.backend.model.CustomerModel;
import ropold.backend.repository.CustomerRepository;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
class CustomerControllerIntegrationTest {

    @MockitoBean
    private Cloudinary cloudinary;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CustomerRepository customerRepository;

    @BeforeEach
    void setup() {
        customerRepository.deleteAll();

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

        customerRepository.saveAll(java.util.List.of(customerModel1, customerModel2));
    }

    @Test
    void testGetAllCustomers_shouldReturnAllCustomers() throws Exception {
        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Max Mustermann"))
                .andExpect(jsonPath("$[1].name").value("Erika Musterfrau"));
    }

    @Test
    void testGetCustomerById_shouldReturnCustomer() throws Exception {
        mockMvc.perform(get("/api/customers/00000000-0000-0000-0000-000000000001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Max Mustermann"))
                .andExpect(jsonPath("$.contactPerson").value("Contact Person1"))
                .andExpect(jsonPath("$.notes").value("Notes1"));
    }

    @Test
    void testGetCustomerById_notFound() throws Exception {
        mockMvc.perform(get("/api/customers/00000000-0000-0000-0000-000000000999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testPostCustomer_shouldReturnCreated() throws Exception {

        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        mockOAuth2User, null, java.util.Collections.singleton(
                        new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER")
                )
                )
        );

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://www.test.de/"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/customers")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("customerModel", "", "application/json", """
                                    {
                                      "id": null,
                                      "name": "Max Mustermann3",
                                      "contact_person": "Contact Person3",
                                      "notes": "Notes3",
                                      "imageUrl": "https://example.com/customer3.jpg"
                                    }
                                """.getBytes())))
                .andExpect(status().isCreated());

        List<CustomerModel> allCustomers = customerRepository.findAll();
        Assertions.assertEquals(1, allCustomers.size());
    }


}
