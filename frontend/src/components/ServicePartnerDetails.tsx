import {useEffect, useState} from "react";
import {DefaultServicePartner, type ServicePartnerModel} from "./model/ServicePartnerModel.ts";
import {useParams} from "react-router-dom";
import axios from "axios";
import {translatedInfo} from "./utils/TranslatedInfo.ts";
import type {ScannerModel} from "./model/ScannerModel.ts";
import type {CustomerModel} from "./model/CustomerModel.ts";

type ServicePartnerDetailsProps = {
    language: string;
    allActiveScanner: ScannerModel [];
    allActiveCustomer: CustomerModel[];

    allArchivedScanner: ScannerModel[];
    allArchivedCustomer: CustomerModel[];
}

export default function ServicePartnerDetails(props: Readonly<ServicePartnerDetailsProps>) {
    const [servicePartner, setServicePartner] = useState<ServicePartnerModel>(DefaultServicePartner);
    const {id} = useParams<{id: string}>();

    useEffect(() => {
        if(!id) return;
        axios
            .get(`/api/service-partners/${id}`)
            .then(response => setServicePartner(response.data))
            .catch(error => {
                console.error("Error fetching service partner details", error);
            });
    }, [id]);

    function toggleArchiveStatus() {
        if (!servicePartner) return;

        axios
            .put(`/api/service-partners/${servicePartner.id}/archive`)
            .then((response) => setServicePartner(response.data))
            .catch((error) => console.error("Error updating archive status", error));
    }

    return(
        <div>
            <h2>Service Partner Details</h2>
            {servicePartner ? (
                <div className="service-partner-details">
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
                        <button className="button-blue">Edit</button>
                        <button className="button-grey" onClick={toggleArchiveStatus}>{servicePartner.isArchived ? "Unarchive" : "Archive"}</button>
                        <button className="button-delete">Delete</button>
                    </div>
                </div>
            ) : (
                <p>{translatedInfo["Loading"][props.language]}...</p>
            )}
        </div>
    )
}