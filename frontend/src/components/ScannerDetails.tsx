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
            .get(`/api/scanners/${id}`)
            .then((response) => setScanner(response.data))
            .catch((error) => console.error("Error fetching customer details", error));
    }, [id]);


    return(
        <div>
            <h2>Scanner Details</h2>
            {scanner ? (
                <div className="scanner-details">
                    <p><strong>{translatedInfo["sql-id"][props.language]}:</strong> {scanner.id}</p>
                    <p><strong>{translatedInfo["modelName"][props.language]}:</strong> {scanner.modelName || "—"}</p>
                    <p><strong>{translatedInfo["manufacturerCode"][props.language]}:</strong> {scanner.manufacturerCode || "—"}</p>
                    <p><strong>{translatedInfo["serialNumber"][props.language]}:</strong> {scanner.serialNumber || "—"}</p>
                    <p><strong>{translatedInfo["scannerNrNavision"][props.language]}:</strong> {scanner.scannerNrNavision || "—"}</p>
                    <p><strong>{translatedInfo["contractNumber"][props.language]}:</strong> {scanner.contractNumber || "—"}</p>
                    <p><strong>{translatedInfo["deviceType"][props.language]}:</strong> {scanner.deviceType}</p>
                    <p><strong>{translatedInfo["contractType"][props.language]}:</strong> {scanner.contractType}</p>
                    <p><strong>{translatedInfo["status"][props.language]}:</strong> {scanner.status}</p>
                    <p><strong>{translatedInfo["startDate"][props.language]}:</strong> {scanner.startDate || "—"}</p>
                    <p><strong>{translatedInfo["endDate"][props.language]}:</strong> {scanner.endDate || "—"}</p>
                    <p><strong>{translatedInfo["slaMaintenance"][props.language]}:</strong> {scanner.slaMaintenance || "—"}</p>
                    <p><strong>{translatedInfo["locationAddress"][props.language]}:</strong> {scanner.locationAddress || "—"}</p>
                    <p><strong>{translatedInfo["contactPersonDetails"][props.language]}:</strong> {scanner.contactPersonDetails || "—"}</p>
                    <p><strong>{translatedInfo["acquisitionDate"][props.language]}:</strong> {scanner.acquisitionDate || "—"}</p>
                    <p><strong>{translatedInfo["purchasedBy"][props.language]}:</strong> {scanner.purchasedBy || "—"}</p>
                    <p><strong>{translatedInfo["purchasePrice"][props.language]}:</strong> {scanner.purchasePrice ? `€${scanner.purchasePrice}` : "—"}</p>
                    <p><strong>{translatedInfo["salePrice"][props.language]}:</strong> {scanner.salePrice ? `€${scanner.salePrice}` : "—"}</p>
                    <p><strong>{translatedInfo["depreciation"][props.language]}:</strong> {scanner.depreciation ? `€${scanner.depreciation}` : "—"}</p>
                    <p><strong>{translatedInfo["customerID"][props.language]}:</strong> {scanner.customerId || "—"}</p>
                    <p><strong>{translatedInfo["servicePartnerId"][props.language]}:</strong> {scanner.servicePartnerId || "—"}</p>
                    <p><strong>{translatedInfo["notes"][props.language]}:</strong> {scanner.notes || "—"}</p>
                    <p><strong>{translatedInfo["isArchived"][props.language]}:</strong> {scanner.isArchived ? translatedInfo["Yes"][props.language] : translatedInfo["No"][props.language]}</p>
                    {scanner.imageUrl && (
                        <div>
                            <p><strong>{translatedInfo["image"][props.language]}:</strong></p>
                            <img
                                className="details-image"
                                src={scanner.imageUrl}
                                alt={scanner.modelName || "Scanner"}
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