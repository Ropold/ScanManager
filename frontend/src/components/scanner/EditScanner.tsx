import type {CustomerModel} from "../model/CustomerModel.ts";
import type {ServicePartnerModel} from "../model/ServicePartnerModel.ts";
import {
    type ContractType,
    DefaultScanner,
    type DeviceType,
    type ScannerModel,
    type ScannerStatus
} from "../model/ScannerModel.ts";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {onFileChange, onImageCancel} from "../utils/ComponentsFunctions.ts";
import ScannerForm from "./ScannerForm.tsx";

type EditScannerProps = {
    language: string;
    allActiveCustomer: CustomerModel[];
    allActiveServicePartner: ServicePartnerModel[];
    handleScannerUpdate:(scanner: ScannerModel) => void;
}

export default function EditScanner(props: Readonly<EditScannerProps>) {
    const [scanner, setScanner] = useState<ScannerModel>(DefaultScanner);
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();

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
    const [isArchived, setIsArchived] = useState<boolean>(false);

    const [image, setImage] = useState<File | null>(null);
    const [imageChanged, setImageChanged] = useState(false);
    const [imageDeleted, setImageDeleted] = useState(false);


    useEffect(() => {
        if(!id) return;
        axios
            .get(`/api/scanners/${id}`)
            .then((response) => {
                const scanner = response.data;
                setScanner(scanner);
                setCustomerId(scanner.customerId || "");
                setServicePartnerId(scanner.servicePartnerId || "");
                setModelName(scanner.modelName || "");
                setManufacturerCode(scanner.manufacturerCode || "");
                setSerialNumber(scanner.serialNumber || "");
                setScannerNrNavision(scanner.scannerNrNavision || "");
                setContractNumber(scanner.contractNumber || "");
                setStartDate(scanner.startDate || "");
                setEndDate(scanner.endDate || "");
                setSlaMaintenance(scanner.slaMaintenance || "");
                setLocationAddress(scanner.locationAddress || "");
                setContactPersonDetails(scanner.contactPersonDetails || "");
                setAcquisitionDate(scanner.acquisitionDate || "");
                setPurchasedBy(scanner.purchasedBy || "");
                setDeviceType(scanner.deviceType || "SCANNER");
                setContractType(scanner.contractType || "AUTORENEWAL");
                setStatus(scanner.status || "ACTIVE");
                setPurchasePrice(scanner.purchasePrice);
                setSalePrice(scanner.salePrice);
                setDepreciation(scanner.depreciation);
                setNotes(scanner.notes || "");
                setIsArchived(scanner.isArchived);
            })
            .catch((error) => console.error("Error fetching scanner details", error));
    }, [id]);

    function handleSaveEdit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        if(!scanner || scanner === DefaultScanner) return;

        // Image-URL Logik
        let updatedImageUrl = scanner.imageUrl;
        if (imageChanged) {
            if (image) {
                updatedImageUrl = "temp-image"; // Backend ersetzt das mit echter URL
            } else if (imageDeleted) {
                updatedImageUrl = ""; // Image wurde gelöscht
            }
        }

        const updatedScannerData = {
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
            notes,
            imageUrl: updatedImageUrl,
            isArchived
        }

        const data = new FormData();
        if (imageChanged && image) {
            data.append("image", image);
        }
        data.append("scannerModel", new Blob(
            [JSON.stringify(updatedScannerData)],
            {type: "application/json"}
        ));

        axios
            .put(`/api/scanners/${scanner.id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                props.handleScannerUpdate(response.data);
                navigate(`/scanners/${scanner.id}`);
            })
            .catch((error) => {
                console.error(error);
                alert("An unexpected error occurred. Please try again.");
            });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFileChange(e, setImage);
        setImageChanged(true);
    };

    const handleImageCancel = () => {
        onImageCancel(setImage);
        setImageChanged(true);
        setImageDeleted(true);
    };

    const backNavigationPath = scanner?.id
        ? `/scanners/${scanner.id}`
        : "/scanners";

    return(
        <>
            <div>EditScanner</div>
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
                handleSubmit={handleSaveEdit}
                isArchived={isArchived}
                setIsArchived={setIsArchived}
                imageChanged={imageChanged}
                setImageChanged={setImageChanged}
                imageDeleted={imageDeleted}
                setImageDeleted={setImageDeleted}
                existingImageUrl={scanner.imageUrl}
            />
        </>
    )
}