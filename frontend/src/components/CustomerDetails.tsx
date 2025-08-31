import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {type CustomerModel, DefaultCustomer} from "./model/CustomerModel.ts";
import axios from "axios";
import {translatedInfo} from "./utils/TranslatedInfo.ts";
import "./styles/Details.css"

type CustomerDetailsProps = {
    language: string;
}

export default function CustomerDetails(props: Readonly<CustomerDetailsProps>) {
    const [customer, setCustomer] = useState<CustomerModel>(DefaultCustomer);
    const {id} = useParams<{id: string}>();

    useEffect(() => {
        if(!id) return;
        axios
            .get(`/api/customers/${id}`)
            .then((response) => setCustomer(response.data))
            .catch((error) => console.error("Error fetching customer details", error));
    }, [id]);

    function toggleArchiveStatus() {
        if (!customer) return;

        axios
            .put(`/api/customers/${customer.id}/archive`)
            .then((response) => setCustomer(response.data))
            .catch((error) => console.error("Error updating archive status", error));
    }

    return (
        <div>
            <h2>Customer Details</h2>
            {customer ? (
                <div className={`details-container ${customer.isArchived ? 'archived' : ''}`}>
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
                        <button className="button-blue">Edit</button>
                        <button className="button-grey" onClick={toggleArchiveStatus}>{customer.isArchived ? "Unarchive" : "Archive"}</button>
                        <button className="button-delete">Delete</button>
                    </div>

                    <div>
                        <p>Scanner inc.</p>
                    </div>
                </div>
            ) : (
                <p>{translatedInfo["Loading"][props.language]}...</p>
            )}
        </div>
    );
}