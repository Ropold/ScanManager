package ropold.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "scanners")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScannerModel {

    @Id
    private UUID id;

    @Column(name = "customer_id")
    private UUID customerId;

    @Column(name = "service_partner_id")
    private UUID servicePartnerId;

    @Column(name = "model_name")
    private String modelName;

    @Column(name = "manufacturer_code", length = 10)
    private String manufacturerCode;

    @Column(name = "serial_number", length = 100)
    private String serialNumber;

    @Column(name = "scanner_nr_navision", length = 50)
    private String scannerNrNavision;

    @Column(name = "contract_number", length = 100)
    private String contractNumber;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "sla_maintenance")
    private String slaMaintenance;

    @Column(name = "location_address", columnDefinition = "NVARCHAR(MAX)")
    private String locationAddress;

    @Column(name = "contact_person_details", columnDefinition = "NVARCHAR(MAX)")
    private String contactPersonDetails;

    @Column(name = "acquisition_date")
    private LocalDate acquisitionDate;

    @Column(name = "purchased_by")
    private String purchasedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "device_type", length = 20)
    private DeviceType deviceType;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", length = 20)
    private ContractType contractType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private ScannerStatus status;

    @Column(name = "purchase_price", precision = 10, scale = 2)
    private BigDecimal purchasePrice;

    @Column(name = "sale_price", precision = 10, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "depreciation", precision = 10, scale = 2)
    private BigDecimal depreciation;

    @Column(name = "notes", columnDefinition = "NVARCHAR(MAX)")
    private String notes;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_archived", nullable = false, columnDefinition = "BIT DEFAULT 0")
    private Boolean isArchived = false;

}