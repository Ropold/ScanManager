import type {ContractType, DeviceType, ScannerStatus} from "../model/ScannerModel.ts";
import {useNavigate} from "react-router-dom";
import {translatedInfo} from "../utils/TranslatedInfo.ts";
import type {CustomerModel} from "../model/CustomerModel.ts";
import type {ServicePartnerModel} from "../model/ServicePartnerModel.ts";

type ScannerFormProps = {
    language: string;
    backNavigationPath: string;
    allActiveCustomer: CustomerModel[];
    allActiveServicePartner: ServicePartnerModel[];
    customerId?: string;
    setCustomerId?: React.Dispatch<React.SetStateAction<string | undefined>>;
    servicePartnerId?: string;
    setServicePartnerId?: React.Dispatch<React.SetStateAction<string | undefined>>;
    modelName: string;
    setModelName: React.Dispatch<React.SetStateAction<string>>;
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
    purchasePrice?: number;
    setPurchasePrice?: React.Dispatch<React.SetStateAction<number | undefined>>;
    salePrice?: number;
    setSalePrice?: React.Dispatch<React.SetStateAction<number | undefined>>;
    depreciation?: number;
    setDepreciation?: React.Dispatch<React.SetStateAction<number | undefined>>;
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
        <div>
            <form onSubmit={handleSubmit}>
                <div className="edit-form">
                    {/* Customer Dropdown */}
                    <label>
                        {translatedInfo["customerName"][props.language]}:
                        <select
                            className="input-small"
                            value={customerId}
                            onChange={(e) => setCustomerId?.(e.target.value)}
                            required
                        >
                            <option value="">-- Select Customer --</option>
                            {props.allActiveCustomer.map(customer => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Service Partner Dropdown */}
                    <label>
                        {translatedInfo["servicePartnerName"][props.language]}:
                        <select
                            className="input-small"
                            value={servicePartnerId}
                            onChange={(e) => setServicePartnerId?.(e.target.value)}
                        >
                            <option value="">-- Select Service Partner --</option>
                            {props.allActiveServicePartner.map(sp => (
                                <option key={sp.id} value={sp.id}>
                                    {sp.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        {translatedInfo["modelName"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={modelName}
                            onChange={(e) => setModelName(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        {translatedInfo["manufacturerCode"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={manufacturerCode}
                            onChange={(e) => setManufacturerCode(e.target.value)}
                        />
                    </label>

                    <label>
                        {translatedInfo["serialNumber"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={serialNumber}
                            onChange={(e) => setSerialNumber(e.target.value)}
                        />
                    </label>

                    <label>
                        {translatedInfo["scannerNrNavision"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={scannerNrNavision}
                            onChange={(e) => setScannerNrNavision(e.target.value)}
                        />
                    </label>

                    <label>
                        {translatedInfo["contractNumber"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={contractNumber}
                            onChange={(e) => setContractNumber(e.target.value)}
                        />
                    </label>

                    <label>
                        {translatedInfo["slaMaintenance"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={slaMaintenance}
                            onChange={(e) => setSlaMaintenance(e.target.value)}
                        />
                    </label>

                    <label>
                        {translatedInfo["startDate"][props.language]}:
                        <input
                            className="input-small"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </label>

                    <label>
                        {translatedInfo["endDate"][props.language]}:
                        <input
                            className="input-small"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </label>

                    <label>
                        {translatedInfo["locationAddress"][props.language]}:
                        <textarea
                            className="textarea-large"
                            value={locationAddress}
                            onChange={(e) => setLocationAddress(e.target.value)}
                        />
                    </label>

                    <label>
                        {translatedInfo["contactPersonDetails"][props.language]}:
                        <textarea
                            className="textarea-large"
                            value={contactPersonDetails}
                            onChange={(e) => setContactPersonDetails(e.target.value)}
                        />
                    </label>

                    <label>
                        {translatedInfo["acquisitionDate"][props.language]}:
                        <input
                            className="input-small"
                            type="date"
                            value={acquisitionDate}
                            onChange={(e) => setAcquisitionDate(e.target.value)}
                        />
                    </label>

                    <label>
                        {translatedInfo["purchasedBy"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={purchasedBy}
                            onChange={(e) => setPurchasedBy(e.target.value)}
                        />
                    </label>

                    <label>
                        {translatedInfo["deviceType"][props.language]}:
                        <select
                            className="input-small"
                            value={deviceType}
                            onChange={(e) => setDeviceType(e.target.value as DeviceType)}
                        >
                            <option value="SCANNER">Scanner</option>
                            <option value="FLATBED_UNIT">Flatbed Unit</option>
                        </select>
                    </label>

                    <label>
                        {translatedInfo["contractType"][props.language]}:
                        <select
                            className="input-small"
                            value={contractType}
                            onChange={(e) => setContractType(e.target.value as ContractType)}
                        >
                            <option value="AUTORENEWAL">Auto Renewal</option>
                            <option value="FIXED_END">Fixed End</option>
                        </select>
                    </label>

                    <label>
                        {translatedInfo["status"][props.language]}:
                        <select
                            className="input-small"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ScannerStatus)}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="EXPIRED">Expired</option>
                        </select>
                    </label>

                    <label>
                        {translatedInfo["purchasePrice"][props.language]}:
                        <input
                            className="input-small"
                            type="number"
                            value={purchasePrice || ""}
                            onChange={(e) => setPurchasePrice?.(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                    </label>

                    <label>
                        {translatedInfo["salePrice"][props.language]}:
                        <input
                            className="input-small"
                            type="number"
                            value={salePrice || ""}
                            onChange={(e) => setSalePrice?.(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                    </label>

                    <label>
                        {translatedInfo["depreciation"][props.language]}:
                        <input
                            className="input-small"
                            type="number"
                            value={depreciation || ""}
                            onChange={(e) => setDepreciation?.(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                    </label>

                    <label>
                        {translatedInfo["notes"][props.language]}:
                        <textarea
                            className="textarea-large"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </label>

                    {/* Position 6 - Image Upload */}
                    <label>
                        <span>Image:</span>
                        <input type="file" onChange={handleFileChange} />
                    </label>

                    {/* Position 7 - Image */}
                    <div>
                        {renderImagePreview()}
                    </div>

                    {/* Position 8 - Button */}
                    <div>
                        {(image || (existingImageUrl && !imageDeleted)) && (
                            <button
                                type="button"
                                onClick={handleImageCancel}
                                className="button-blue button-remove-image"
                            >
                                {translatedInfo["Remove Image"][props.language]}
                            </button>
                        )}
                    </div>

                    <div>
                        {isArchived !== undefined && (
                            <label>
                                {translatedInfo["isArchived"][props.language]}:
                                <select
                                    className="input-small"
                                    value={isArchived ? "true" : "false"}
                                    onChange={(e) => setIsArchived?.(e.target.value === "true")}
                                >
                                    <option value="false">{translatedInfo["Active"][props.language]}</option>
                                    <option value="true">{translatedInfo["Archived"][props.language]}</option>
                                </select>
                            </label>
                        )}
                    </div>

                </div>
                <button type="submit" className="button-blue margin-top-50">
                    {isEditMode
                        ? translatedInfo["Update Scanner"][props.language]
                        : translatedInfo["Add Scanner"][props.language]
                    }
                </button>
                <button type="button" className="button-blue margin-left-20" onClick={() => navigate(backNavigationPath)}>
                    back
                </button>
            </form>
        </div>
    );
}