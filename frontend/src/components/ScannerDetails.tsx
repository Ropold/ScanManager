import {useEffect, useState} from "react";
import {DefaultScanner, type ScannerModel} from "./model/ScannerModel.ts";
import {useParams} from "react-router-dom";
import axios from "axios";
import {translatedInfo} from "./utils/TranslatedInfo.ts";

type ScannerDetailsProps = {
    language: string;
}

export default function ScannerDetails(props: Readonly<ScannerDetailsProps>) {
    const [scanner, setScanner]= useState<ScannerModel>(DefaultScanner)
    const {id} = useParams<{id: string}>();

    useEffect(() => {
        if(!id) return;
        axios
            .get(`/api/scanner/${id}`)
            .then((response) => setScanner(response.data))
            .catch((error) => console.error("Error fetching customer details", error));
    }, [id]);


    return(
        <div>
            <h2>Scanner Details</h2>
            {scanner ? (
                <div className="scanner-details">
                    <p><strong>{translatedInfo["SQL-ID"][props.language]}:</strong> {scanner.id}</p>
                    <p><strong>{translatedInfo["Device Name"][props.language]}:</strong> {scanner.deviceName || "—"}</p>
                    <p><strong>{translatedInfo["Serial Number"][props.language]}:</strong> {scanner.serialNumber || "—"}</p>
                    <p><strong>{translatedInfo["Contract Number"][props.language]}:</strong> {scanner.contractNumber || "—"}</p>
                    <p><strong>{translatedInfo["Invoice Number"][props.language]}:</strong> {scanner.invoiceNumber || "—"}</p>
                    <p><strong>{translatedInfo["Contract Type"][props.language]}:</strong> {scanner.contractType}</p>
                    <p><strong>{translatedInfo["Status"][props.language]}:</strong> {scanner.status}</p>
                    <p><strong>{translatedInfo["No Maintenance"][props.language]}:</strong> {scanner.noMaintenance ? translatedInfo["Yes"][props.language] : translatedInfo["No"][props.language]}</p>
                    <p><strong>{translatedInfo["Start Date"][props.language]}:</strong> {scanner.startDate || "—"}</p>
                    <p><strong>{translatedInfo["End Date"][props.language]}:</strong> {scanner.endDate || "—"}</p>
                    <p><strong>{translatedInfo["Purchase Price"][props.language]}:</strong> {scanner.purchasePrice ? `€${scanner.purchasePrice}` : "—"}</p>
                    <p><strong>{translatedInfo["Sale Price"][props.language]}:</strong> {scanner.salePrice ? `€${scanner.salePrice}` : "—"}</p>
                    <p><strong>{translatedInfo["Depreciation"][props.language]}:</strong> {scanner.depreciation ? `€${scanner.depreciation}` : "—"}</p>
                    <p><strong>{translatedInfo["Customer ID"][props.language]}:</strong> {scanner.customerId}</p>
                    <p><strong>{translatedInfo["Service Partner ID"][props.language]}:</strong> {scanner.servicePartnerId}</p>
                    <p><strong>{translatedInfo["Maintenance Content"][props.language]}:</strong> {scanner.maintenanceContent || "—"}</p>
                    <p><strong>{translatedInfo["Notes"][props.language]}:</strong> {scanner.note || "—"}</p>
                    {scanner.imageUrl && (
                        <div>
                            <p><strong>{translatedInfo["Image"][props.language]}:</strong></p>
                            <img
                                className="details-image"
                                src={scanner.imageUrl}
                                alt={scanner.deviceName || "Scanner"}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <p>{translatedInfo["Loading"][props.language]}...</p>
            )}
        </div>
    )
}