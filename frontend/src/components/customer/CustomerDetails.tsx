import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {type CustomerModel, DefaultCustomer} from "../model/CustomerModel.ts";
import axios from "axios";
import {translatedInfo} from "../utils/TranslatedInfo.ts";
import "../styles/Details.css"
import type {ScannerModel} from "../model/ScannerModel.ts";
import ScannerCard from "../scanner/ScannerCard.tsx";
import type {ServicePartnerModel} from "../model/ServicePartnerModel.ts";
import {useAutoScrollToTop} from "../utils/ComponentsFunctions.ts";

type CustomerDetailsProps = {
    language: string;
    allActiveScanner: ScannerModel [];
    allActiveServicePartner: ServicePartnerModel[];

    allArchivedScanner: ScannerModel[];
    allArchivedServicePartner: ServicePartnerModel[];
    handleCustomerDelete: (id: string) => void;
    handleCustomerUpdate: (updatedCustomer: CustomerModel) => void;
}

export default function CustomerDetails(props: Readonly<CustomerDetailsProps>) {
    useAutoScrollToTop();
    const [customer, setCustomer] = useState<CustomerModel>(DefaultCustomer);
    const [filteredCustomerScanners, setFilteredCustomerScanners] = useState<ScannerModel[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams<{id: string}>();

    useEffect(() => {
        if(!id) return;
        axios
            .get(`/api/customers/${id}`)
            .then((response) => setCustomer(response.data))
            .catch((error) => console.error("Error fetching customer details", error));
    }, [id]);

    useEffect(() => {
        if (!customer?.id) return;

        const allScanners = [...props.allActiveScanner, ...props.allArchivedScanner];
        const customerScanners = allScanners.filter(scanner =>
            scanner.customerId === customer.id
        );

        setFilteredCustomerScanners(customerScanners);
    }, [customer, props.allActiveScanner, props.allArchivedScanner]);

    function toggleArchiveStatus() {
        if (!customer) return;

        axios
            .put(`/api/customers/${customer.id}/archive`)
            .then((response) => {
                setCustomer(response.data)
                props.handleCustomerUpdate(response.data);
            })
            .catch((error) => console.error("Error updating archive status", error));
    }

    const getServicePartnerName = (servicePartnerId: string | undefined) => {
        if (!servicePartnerId) return undefined;
        const allServicePartners = [...props.allActiveServicePartner, ...props.allArchivedServicePartner];
        return allServicePartners.find(sp => sp.id === servicePartnerId)?.name;
    };

    function handleConfirmDelete(){
        if(!customer?.id) return;

        axios
            .delete(`/api/customers/${customer.id}`)
            .then(() => {
                console.log("Customer deleted successfully");
                props.handleCustomerDelete(customer.id); // Liste aktualisieren
            })
            .catch((error) => {
                console.error("Error deleting customer:", error);
                alert("An unexpected error occurred. Please try again.");
            })
            .finally(() => {
                setShowPopup(false);
                navigate("/customers/");
            });
    }
    function handleCancel(){
        setShowPopup(false);
    }

    return (
        <div>
            <h2>Customer Details</h2>
            {customer ? (
                <div className="details-container">
                    <p><strong>{translatedInfo["sql-id"][props.language]}:</strong> {customer.id}</p>
                    <p><strong>{translatedInfo["debitorNrNavision"][props.language]}:</strong> {customer.debitorNrNavision}</p>
                    <p><strong>{translatedInfo["customerName"][props.language]}:</strong> {customer.name}</p>
                    <p><strong>{translatedInfo["contactPerson"][props.language]}:</strong> {customer.contactPerson}</p>
                    <p><strong>{translatedInfo["contactDetails"][props.language]}:</strong> {customer.contactDetails}</p>
                    <p><strong>{translatedInfo["notes"][props.language]}:</strong> {customer.notes}</p>
                    <p><strong>{translatedInfo["isArchived"][props.language]}: </strong>
                        {customer.isArchived
                            ? translatedInfo["Yes"][props.language]
                            : translatedInfo["No"][props.language]
                        }
                    </p>
                    {customer.imageUrl && (
                        <div>
                            <p><strong>{translatedInfo["image"][props.language]}:</strong></p>
                            <img
                                className="details-image"
                                src={customer.imageUrl}
                                alt={customer.name}
                            />
                        </div>
                    )}
                    <div className="details-buttons">
                        <button className="button-blue" onClick={() => navigate(`/customers/${customer.id}/edit`)}>Edit</button>
                        <button className="button-grey" onClick={toggleArchiveStatus}>{customer.isArchived ? "Unarchive" : "Archive"}</button>
                        <button className="button-delete" onClick={() => setShowPopup(true)} >Delete</button>
                    </div>

                    <div className="scanner-card-container">
                        <h1>Scanner des Kunden</h1>
                        {filteredCustomerScanners.map((s: ScannerModel) => (
                            <ScannerCard
                                key={s.id}
                                scanner={s}
                                customerName={customer.name}
                                servicePartnerName={getServicePartnerName(s.servicePartnerId)}
                                language={props.language}
                            />
                        ))}
                    </div>

                    {showPopup && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <h3>Confirm Deletion</h3>
                                <p>Are you sure you want to delete this Customer?</p>
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
    );
}