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
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerModel {

    @Id
    private UUID id;

    @Column(name = "debitor_nr_navision", length = 50)
    private String debitorNrNavision;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "contact_person")
    private String contactPerson;

    @Column(name = "contact_details", columnDefinition = "NVARCHAR(MAX)")
    private String contactDetails;

    @Column(name = "notes", columnDefinition = "NVARCHAR(MAX)")
    private String notes;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_archived", nullable = false, columnDefinition = "BIT DEFAULT 0")
    private Boolean isArchived = false;
}