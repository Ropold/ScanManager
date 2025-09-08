import type {ContractType, DeviceType, ScannerModel, ScannerStatus} from "../model/ScannerModel.ts";
import {useState} from "react";
import type {ServicePartnerModel} from "../model/ServicePartnerModel.ts";
import type {CustomerModel} from "../model/CustomerModel.ts";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {onFileChange, onImageCancel} from "../utils/ComponentsFunctions.ts";
import ScannerForm from "./ScannerForm.tsx";

type AddNewScannerProps = {
    language: string;
    handleNewScannerSubmit: (newScanner: ScannerModel) => void;
    allActiveCustomer: CustomerModel[];
    allActiveServicePartner: ServicePartnerModel[];
}

export default function AddNewScanner(props: Readonly<AddNewScannerProps>) {

    const [customerId, setCustomerId] = useState<string | undefined>("");
    const [servicePartnerId, setServicePartnerId] = useState<string | undefined>("");
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
    const [purchasePrice, setPurchasePrice] = useState<number | undefined>(undefined);
    const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
    const [depreciation, setDepreciation] = useState<number | undefined>(undefined);
    const [notes, setNotes] = useState<string>("");

    const [image, setImage] = useState<File | null>(null);
    const navigate = useNavigate();

    function handleNewAddSubmit(e: React.FormEvent<HTMLFormElement>) {
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

    const backNavigationPath = "/scanners";

    return (
        <div>
            <h2>Add New Scanner</h2>
            <ScannerForm
                language={props.language}
                backNavigationPath={backNavigationPath}
                allActiveCustomer={props.allActiveCustomer}
                allActiveServicePartner={props.allActiveServicePartner}
                customerId={customerId}
                setCustomerId={setCustomerId}
                servicePartnerId={servicePartnerId}
                setServicePartnerId={setServicePartnerId}
                modelName={modelName}
                setModelName={setModelName}
                manufacturerCode={manufacturerCode}
                setManufacturerCode={setManufacturerCode}
                serialNumber={serialNumber}
                setSerialNumber={setSerialNumber}
                scannerNrNavision={scannerNrNavision}
                setScannerNrNavision={setScannerNrNavision}
                contractNumber={contractNumber}
                setContractNumber={setContractNumber}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                slaMaintenance={slaMaintenance}
                setSlaMaintenance={setSlaMaintenance}
                locationAddress={locationAddress}
                setLocationAddress={setLocationAddress}
                contactPersonDetails={contactPersonDetails}
                setContactPersonDetails={setContactPersonDetails}
                acquisitionDate={acquisitionDate}
                setAcquisitionDate={setAcquisitionDate}
                purchasedBy={purchasedBy}
                setPurchasedBy={setPurchasedBy}
                deviceType={deviceType}
                setDeviceType={setDeviceType}
                contractType={contractType}
                setContractType={setContractType}
                status={status}
                setStatus={setStatus}
                purchasePrice={purchasePrice}
                setPurchasePrice={setPurchasePrice}
                salePrice={salePrice}
                setSalePrice={setSalePrice}
                depreciation={depreciation}
                setDepreciation={setDepreciation}
                notes={notes}
                setNotes={setNotes}
                image={image}
                handleFileChange={handleFileChange}
                handleImageCancel={handleImageCancel}
                handleSubmit={handleNewAddSubmit}
            />
        </div>
    )

}