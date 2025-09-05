import type {ContractType, DeviceType, ScannerStatus} from "../model/ScannerModel.ts";
import {useNavigate} from "react-router-dom";

type ScannerFormProps = {
    language: string;
    backNavigationPath: string;
    customerId?: string;
    setCustomerId?: React.Dispatch<React.SetStateAction<string | undefined>>;
    servicePartnerId?: string;
    setServicePartnerId?: React.Dispatch<React.SetStateAction<string | undefined>>;
    modelName: string;
    setModelName: React.Dispatch<React.SetStateAction<string>>;
    manufacturerName: string;
    setManufacturerName: React.Dispatch<React.SetStateAction<string>>;
    manufacturerCode: string;
    setManufacturerCode: React.Dispatch<React.SetStateAction<string>>;
    serialNumber: string;
    setSerialNumber: React.Dispatch<React.SetStateAction<string>>;
    scannerNrNavision: string;
    setScannerNrNavision: React.Dispatch<React.SetStateAction<string>>;
    contractNumber: string;
    setContractNumber: React.Dispatch<React.SetStateAction<string>>;
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    slaMaintenance: string;
    setSlaMaintenance: React.Dispatch<React.SetStateAction<string>>;
    locationAddress: string;
    setLocationAddress: React.Dispatch<React.SetStateAction<string>>;
    contactPersonDetails: string;
    setContactPersonDetails: React.Dispatch<React.SetStateAction<string>>;
    acquisitionDate: string;
    setAcquisitionDate: React.Dispatch<React.SetStateAction<string>>;
    purchasedBy: string;
    setPurchasedBy: React.Dispatch<React.SetStateAction<string>>;
    deviceType: DeviceType;
    setDeviceType: React.Dispatch<React.SetStateAction<DeviceType>>;
    contractType: ContractType;
    setContractType: React.Dispatch<React.SetStateAction<ContractType>>;
    status: ScannerStatus;
    setStatus: React.Dispatch<React.SetStateAction<ScannerStatus>>;
    purchasePrice: string;
    setPurchasePrice: React.Dispatch<React.SetStateAction<string>>;
    salePrice: string;
    setSalePrice: React.Dispatch<React.SetStateAction<string>>;
    depreciation: string;
    setDepreciation: React.Dispatch<React.SetStateAction<string>>;
    notes: string;
    setNotes: React.Dispatch<React.SetStateAction<string>>;
    image: File | null;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleImageCancel: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isArchived?: boolean;
    setIsArchived?: React.Dispatch<React.SetStateAction<boolean>>;
    imageChanged?: boolean;
    setImageChanged?: React.Dispatch<React.SetStateAction<boolean>>;
    imageDeleted?: boolean;
    setImageDeleted?: React.Dispatch<React.SetStateAction<boolean>>;
    existingImageUrl?: string;
}

export default function ScannerForm(props: Readonly<ScannerFormProps>) {

    const {
        backNavigationPath,
        customerId,
        setCustomerId,
        servicePartnerId,
        setServicePartnerId,
        modelName,
        setModelName,
        manufacturerName,
        setManufacturerName,
        manufacturerCode,
        setManufacturerCode,
        serialNumber,
        setSerialNumber,
        scannerNrNavision,
        setScannerNrNavision,
        contractNumber,
        setContractNumber,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        slaMaintenance,
        setSlaMaintenance,
        locationAddress,
        setLocationAddress,
        contactPersonDetails,
        setContactPersonDetails,
        acquisitionDate,
        setAcquisitionDate,
        purchasedBy,
        setPurchasedBy,
        deviceType,
        setDeviceType,
        contractType,
        setContractType,
        status,
        setStatus,
        purchasePrice,
        setPurchasePrice,
        salePrice,
        setSalePrice,
        depreciation,
        setDepreciation,
        notes,
        setNotes,
        image,
        imageDeleted,
        existingImageUrl,
        isArchived,
        setIsArchived,
        handleFileChange,
        handleImageCancel,
        handleSubmit
    }=props;

    const navigate = useNavigate();

    const isEditMode = backNavigationPath.includes('/scanners/') && backNavigationPath !== '/scanners';

    function renderImagePreview() {
        if (image) {
            return (<img src={URL.createObjectURL(image)} alt="image-preview" className="image-preview" />);
        }
        if (existingImageUrl && !imageDeleted) {
            return (<img src={existingImageUrl} alt="existing-image" className="image-preview" />);
        }
        return null;
    }

    return (
        <div>ScannerForm</div>
    );
}