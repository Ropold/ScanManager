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

    @Column(name = "customer_id", nullable = false)
    private UUID customerId;

    @Column(name = "service_partner_id", nullable = false)
    private UUID servicePartnerId;

    @Column(name = "device_name")
    private String deviceName;

    @Column(name = "serial_number")
    private String serialNumber;

    @Column(name = "contract_number")
    private String contractNumber;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", length = 50)
    private ContractType contractType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private ScannerStatus status;

    @Column(name = "no_maintenance")
    private Boolean noMaintenance;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "purchase_price", precision = 18, scale = 2)
    private BigDecimal purchasePrice;

    @Column(name = "sale_price", precision = 18, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "depreciation", precision = 18, scale = 2)
    private BigDecimal depreciation;

    @Column(name = "maintenance_content", length = 1000)
    private String maintenanceContent;

    @Column(name = "note", length = 1000)
    private String note;

    @Column(name = "image_url", length = 500)
    private String imageUrl;
}