package ropold.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "service_partners")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServicePartnerModel {
    @Id
    private UUID id;

    @Column(name = "name")
    private String name;

    @Column(name = "contact_person")
    private String contactPerson;

    @Column(name = "notes", length = 1000)
    private String notes;

    @Column(name = "image_url", length = 500)
    private String imageUrl;
}
