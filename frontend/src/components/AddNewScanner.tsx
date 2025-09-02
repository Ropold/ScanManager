import type {ContractType, DeviceType, ScannerModel, ScannerStatus} from "./model/ScannerModel.ts";
import {useState} from "react";
import type {ServicePartnerModel} from "./model/ServicePartnerModel.ts";
import type {CustomerModel} from "./model/CustomerModel.ts";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {translatedInfo} from "./utils/TranslatedInfo.ts";
import {onFileChange, onImageCancel} from "./utils/ComponentsFunctions.ts";

type AddNewScannerProps = {
    language: string;
    handleNewScannerSubmit: (newScanner: ScannerModel) => void;
    allActiveCustomer: CustomerModel[];
    allActiveServicePartner: ServicePartnerModel[];
}

export default function AddNewScanner(props: Readonly<AddNewScannerProps>) {

    const [customerId, setCustomerId] = useState<string>("");
    const [servicePartnerId, setServicePartnerId] = useState<string>("");
    const [modelName, setModelName] = useState<string>("");
    const [manufacturerCode, setManufacturerCode] = useState<string>("");
    const [serialNumber, setSerialNumber] = useState<string>("");
    const [scannerNrNavision, setScannerNrNavision] = useState<string>("");
    const [contractNumber, setContractNumber] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [slaMaintenance, setSlaMaintenance] = useState<string>("");
    const [locationAddress, setLocationAddress] = useState<string>("");
    const [contactPersonDetails, setContactPersonDetails] = useState<string>("");
    const [acquisitionDate, setAcquisitionDate] = useState<string>("");
    const [purchasedBy, setPurchasedBy] = useState<string>("");
    const [deviceType, setDeviceType] = useState<DeviceType>("SCANNER");
    const [contractType, setContractType] = useState<ContractType>("AUTORENEWAL");
    const [status, setStatus] = useState<ScannerStatus>("ACTIVE");
    const [purchasePrice, setPurchasePrice] = useState<string>("");
    const [salePrice, setSalePrice] = useState<string>("");
    const [depreciation, setDepreciation] = useState<string>("");
    const [notes, setNotes] = useState<string>("");

    const [image, setImage] = useState<File | null>(null);
    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const scannerData = {
            customerId,
            servicePartnerId,
            modelName,
            manufacturerCode,
            serialNumber,
            scannerNrNavision,
            contractNumber,
            startDate,
            endDate,
            slaMaintenance,
            locationAddress,
            contactPersonDetails,
            acquisitionDate,
            purchasedBy,
            deviceType,
            contractType,
            status,
            purchasePrice,
            salePrice,
            depreciation,
            notes
        };

        const data = new FormData();

        if (image) {
            data.append("image", image);
        }

        data.append("scannerModel", new Blob(
            [JSON.stringify(scannerData)],
            {type: "application/json"}
        ));

        axios
            .post("/api/scanners", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                props.handleNewScannerSubmit(response.data);
                navigate(`/scanners/${response.data.id}`);
            })
            .catch((error) => {
                alert("An unexpected error occurred. Please try again.");
                console.error(error);
            });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFileChange(e, setImage);
    };

    const handleImageCancel = () => {
        onImageCancel(setImage);
    };

    return (
        <div>
            <h2>Add New Scanner</h2>
            <form onSubmit={handleSubmit}>
                <div className="edit-form">
                    {/* Customer Dropdown */}
                    <label>
                        {translatedInfo["customerName"][props.language]}:
                        <select
                            className="input-small"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
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
                            onChange={(e) => setServicePartnerId(e.target.value)}
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
                            type="text"
                            value={purchasePrice}
                            onChange={(e) => setPurchasePrice(e.target.value)}
                        />
                    </label>

                    <label>
                        {translatedInfo["salePrice"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={salePrice}
                            onChange={(e) => setSalePrice(e.target.value)}
                        />
                    </label>

                    <label>
                        {translatedInfo["depreciation"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={depreciation}
                            onChange={(e) => setDepreciation(e.target.value)}
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

                    {/* Image Upload */}
                    <label>
                        Image:
                        <input type="file" onChange={handleFileChange} />
                    </label>

                    {/* Image Preview */}
                    <div>
                        {image && (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="image-preview"
                                className="image-preview"
                            />
                        )}
                    </div>

                    {/* Remove Image Button */}
                    <div>
                        {image && (
                            <button
                                type="button"
                                onClick={handleImageCancel}
                                className="button-blue button-remove-image"
                            >
                                {translatedInfo["Remove Image"][props.language]}
                            </button>
                        )}
                    </div>
                </div>
                <button type="submit" className="button-blue margin-top-50">{translatedInfo["Add New Scanner"][props.language]}</button>
                <button className="button-blue margin-left-20" onClick={()=> navigate("/scanners")} >back</button>
            </form>
        </div>
    )

}