
export type ScannerModel = {
    id: string;
    customerId?: string;
    servicePartnerId?: string;
    modelName?: string;
    manufacturerCode?: string;
    serialNumber?: string;
    scannerNrNavision?: string;
    contractNumber?: string;
    startDate?: string;
    endDate?: string;
    slaMaintenance?: string;
    locationAddress?: string;
    contactPersonDetails?: string;
    acquisitionDate?: string;
    purchasedBy?: string;
    deviceType?: DeviceType;
    contractType?: ContractType;
    status?: ScannerStatus;
    purchasePrice?: number;
    salePrice?: number;
    depreciation?: number;
    notes?: string;
    imageUrl?: string;
    isArchived: boolean;
}

export type ScannerStatus =
    "ACTIVE" |
    "EXPIRED";

export type ContractType =
    "AUTORENEWAL" |
    "FIXED_END";

export type DeviceType =
    "SCANNER" |
    "FLATBED_UNIT";

export const DefaultScanner: ScannerModel = {
    id: "0",
    customerId: undefined,
    servicePartnerId: undefined,
    modelName: "",
    manufacturerCode: "",
    serialNumber: "",
    scannerNrNavision: "",
    contractNumber: "",
    startDate: undefined,
    endDate: undefined,
    slaMaintenance: "",
    locationAddress: "",
    contactPersonDetails: "",
    acquisitionDate: undefined,
    purchasedBy: "",
    deviceType: "SCANNER",
    contractType: "AUTORENEWAL",
    status: "ACTIVE",
    purchasePrice: 0,
    salePrice: 0,
    depreciation: 0,
    notes: "",
    imageUrl: undefined,
    isArchived: false
}