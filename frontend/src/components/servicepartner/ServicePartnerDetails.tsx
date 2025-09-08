import {useEffect, useState} from "react";
import {DefaultServicePartner, type ServicePartnerModel} from "../model/ServicePartnerModel.ts";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {translatedInfo} from "../utils/TranslatedInfo.ts";
import {useAutoScrollToTop} from "../utils/ComponentsFunctions.ts";
import type {CustomerModel} from "../model/CustomerModel.ts";
import CustomerCard from "../customer/CustomerCard.tsx";
import type {ScannerModel} from "../model/ScannerModel.ts";

type ServicePartnerDetailsProps = {
    language: string;
    allActiveScanner: ScannerModel[];
    allActiveCustomer: CustomerModel [];
    allArchivedScanner: ScannerModel[];
    allArchivedCustomer: CustomerModel [];
    handleServicePartnerDelete: (id: string) => void;
    handleServicePartnerUpdate: (updatedServicePartner: ServicePartnerModel) => void;
}

export default function ServicePartnerDetails(props: Readonly<ServicePartnerDetailsProps>) {
    useAutoScrollToTop();
    const [servicePartner, setServicePartner] = useState<ServicePartnerModel>(DefaultServicePartner);
    const [filteredSpCustomers, setFilteredSpCustomers] = useState<CustomerModel[]>([]);
    const {id} = useParams<{id: string}>();
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if(!id) return;
        axios
            .get(`/api/service-partners/${id}`)
            .then(response => setServicePartner(response.data))
            .catch(error => {
                console.error("Error fetching service partner details", error);
            });
    }, [id]);

    useEffect(() => {
        if (!servicePartner?.id) return;

        // 1. Alle Scanner finden, die zu diesem ServicePartner gehören
        const allScanners = [...props.allActiveScanner, ...props.allArchivedScanner];
        const servicePartnerScanners = allScanners.filter(scanner =>
            scanner.servicePartnerId === servicePartner.id
        );

        // 2. Alle Customer IDs aus diesen Scannern sammeln
        const customerIds = servicePartnerScanners
            .map(scanner => scanner.customerId)
            .filter((id, index, arr) => id && arr.indexOf(id) === index); // Unique IDs

        // 3. Customer-Objekte basierend auf IDs finden
        const allCustomers = [...props.allActiveCustomer, ...props.allArchivedCustomer];
        const spCustomers = customerIds
            .map(customerId => allCustomers.find(customer => customer.id === customerId))
            .filter(customer => customer !== undefined);

        setFilteredSpCustomers(spCustomers);
    }, [servicePartner, props.allActiveScanner, props.allArchivedScanner, props.allActiveCustomer, props.allArchivedCustomer]);

    function toggleArchiveStatus() {
        if (!servicePartner) return;

        axios
            .put(`/api/service-partners/${servicePartner.id}/archive`)
            .then((response) => {
                setServicePartner(response.data)
                props.handleServicePartnerUpdate(response.data);
            })
            .catch((error) => console.error("Error updating archive status", error));
    }

    function handleCancel(){
        setShowPopup(false);
    }

    function handleConfirmDelete(){
        if(!servicePartner?.id) return;

        axios
            .delete(`/api/service-partners/${servicePartner.id}`)
            .then(() => {
                console.log("Service Partner deleted successfully");
                props.handleServicePartnerDelete(servicePartner.id);
            })
            .catch((error) => {
                console.error("Error deleting service partner:", error);
                alert("An unexpected error occurred. Please try again.");
            })
            .finally(() => {
                setShowPopup(false);
                navigate("/service-partners");
            });
    }


    return(
        <div>
            <h2>Service Partner Details</h2>
            {servicePartner ? (
                <div className="details-container">
                    <p><strong>{translatedInfo["sql-id"][props.language]}:</strong> {servicePartner.id}</p>
                    <p><strong>{translatedInfo["creditorNrNavision"][props.language]}:</strong> {servicePartner.creditorNrNavision}</p>
                    <p><strong>{translatedInfo["servicePartnerName"][props.language]}:</strong> {servicePartner.name}</p>
                    <p><strong>{translatedInfo["contactPerson"][props.language]}:</strong> {servicePartner.contactPerson}</p>
                    <p><strong>{translatedInfo["contactDetails"][props.language]}:</strong> {servicePartner.contactDetails}</p>
                    <p><strong>{translatedInfo["notes"][props.language]}:</strong> {servicePartner.notes || "—"}</p>
                    {servicePartner.imageUrl && (
                        <div>
                            <p><strong>{translatedInfo["image"][props.language]}:</strong></p>
                            <img
                                className="details-image"
                                src={servicePartner.imageUrl}
                                alt={servicePartner.name}
                            />
                        </div>
                    )}
                    <p><strong>{translatedInfo["isArchived"][props.language]}: </strong>
                        {servicePartner.isArchived
                            ? translatedInfo["Yes"][props.language]
                            : translatedInfo["No"][props.language]
                        }
                    </p>

                    <div className="details-buttons">
                        <button className="button-blue" onClick={() => navigate(`/service-partners/${servicePartner.id}/edit`)}>Edit</button>
                        <button className="button-grey" onClick={toggleArchiveStatus}>{servicePartner.isArchived ? "Unarchive" : "Archive"}</button>
                        <button className="button-delete" onClick={() => setShowPopup(true)} >Delete</button>
                    </div>

                    <div className="customer-card-container">
                        <h1>Betreute Kunden</h1>
                        {filteredSpCustomers.map((c: CustomerModel) => (

                            <CustomerCard
                                key={c.id}
                                customer={c}
                                language={props.language}
                            />
                        ))}
                    </div>

                    {showPopup && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <h3>Confirm Deletion</h3>
                                <p>Are you sure you want to delete this service partner?</p>
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