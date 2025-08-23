
export type ScannerModel = {
    id: string;
    customerId: string;
    servicePartnerId: string;
    deviceName?: string;
    serialNumber?: string;
    contractNumber?: string;
    invoiceNumber?: string;
    deviceType: DeviceType;
    contractType: ContractType;
    status: ScannerStatus;
    noMaintenance?: boolean;
    startDate?: string;
    endDate?: string;
    purchasePrice?: number;
    salePrice?: number;
    depreciation?: number;
    maintenanceContent?: string;
    note?: string;
    imageUrl?: string;
}

export type ScannerStatus =
    "ACTIVE" |
    "EXPIRED";

export type ContractType =
    "AUTORENEWAL" |
    "FIXED_END"

export type DeviceType =
    "SCANNER" |
    "FLATBED_UNIT"

export const DefaultScanner: ScannerModel = {
    id: "0",
    customerId: "0",
    servicePartnerId: "0",
    deviceName: "",
    serialNumber: "",
    contractNumber: "",
    invoiceNumber: "",
    deviceType: "SCANNER",
    contractType: "AUTORENEWAL",
    status: "ACTIVE",
    noMaintenance: false,
    startDate: undefined,
    endDate: undefined,
    purchasePrice: 0,
    salePrice: 0,
    depreciation: 0,
    maintenanceContent: "",
    note: "",
    imageUrl: undefined
}