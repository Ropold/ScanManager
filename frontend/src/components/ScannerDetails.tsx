import {useEffect, useState} from "react";
import {DefaultScanner, type ScannerModel} from "./model/ScannerModel.ts";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {translatedInfo} from "./utils/TranslatedInfo.ts";
import type {CustomerModel} from "./model/CustomerModel.ts";
import type {ServicePartnerModel} from "./model/ServicePartnerModel.ts";
import {getCustomerName, getServicePartnerName} from "./utils/ComponentsFunctions.ts";

type ScannerDetailsProps = {
    language: string;
    allActiveCustomer: CustomerModel[];
    allActiveServicePartner: ServicePartnerModel[];

    allArchivedCustomer: CustomerModel[];
    allArchivedServicePartner: ServicePartnerModel[];
    handleScannerDelete: (id: string) => void;
    handleScannerArchiveToggle: (scanner: ScannerModel) => void;
}

export default function ScannerDetails(props: Readonly<ScannerDetailsProps>) {
    const [scanner, setScanner]= useState<ScannerModel>(DefaultScanner)
    const {id} = useParams<{id: string}>();
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(!id) return;
        axios
            .get(`/api/scanners/${id}`)
            .then((response) => setScanner(response.data))
            .catch((error) => console.error("Error fetching customer details", error));
    }, [id]);

    const customerName = getCustomerName(scanner.customerId, props.allActiveCustomer, props.allArchivedCustomer);
    const servicePartnerName = getServicePartnerName(scanner.servicePartnerId, props.allActiveServicePartner, props.allArchivedServicePartner);

    function toggleArchiveStatus() {
        if (!scanner) return;
        axios
            .put(`/api/scanners/${scanner.id}/archive`)
            .then((response) => {
                setScanner(response.data);
                props.handleScannerArchiveToggle(response.data);
            })
            .catch((error) => console.error("Error updating archive status", error));
    }

    function handleConfirmDelete(){
        if(!scanner?.id) return;

        axios
            .delete(`/api/scanners/${scanner.id}`)
            .then(() => {
                console.log("Scanner deleted successfully");
                props.handleScannerDelete(scanner.id);
            })
            .catch((error) => {
                console.error("Error deleting Scanner:", error);
                alert("An unexpected error occurred. Please try again.");
            })
            .finally(() => {
                setShowPopup(false);
                navigate("/scanners/");
            });
    }
    function handleCancel(){
        setShowPopup(false);
    }

    return(
        <div>
            <h2>Scanner Details</h2>
            {scanner ? (
                <div className="details-container">
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

                    <p><strong>{translatedInfo["customerName"][props.language]}:</strong> {customerName || scanner.customerId || "—"}</p>
                    <p><strong>{translatedInfo["servicePartnerName"][props.language]}:</strong> {servicePartnerName || scanner.servicePartnerId || "—"}</p>

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

                    <div className="details-buttons">
                        <button className="button-blue">Edit</button>
                        <button className="button-grey" onClick={toggleArchiveStatus}>{scanner.isArchived ? "Unarchive" : "Archive"}</button>
                        <button className="button-delete" onClick={() => setShowPopup(true)}>Delete</button>
                    </div>

                    {showPopup && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <h3>Confirm Deletion</h3>
                                <p>Are you sure you want to delete this scanner?</p>
                                <div className="popup-actions">
                                    <button onClick={handleConfirmDelete} className="popup-confirm">Yes, Delete</button>
                                    <button onClick={handleCancel} className="popup-cancel">Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            ) : (
                <p>{translatedInfo["Loading"][props.language]}...</p>
            )}
        </div>
    )
}