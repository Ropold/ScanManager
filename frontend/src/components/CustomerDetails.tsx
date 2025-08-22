import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {type CustomerModel, DefaultCustomer} from "./model/CustomerModel.ts";
import axios from "axios";
import {translatedInfo} from "./utils/TranslatedInfo.ts";

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


    return (
        <div>
            <h2>Customer Details</h2>
            {customer ? (
                <div className="customer-details">
                    <p><strong>{translatedInfo["SQL-ID"][props.language]}:</strong> {customer.id}</p>
                    <p><strong>{translatedInfo["Name"][props.language]}:</strong> {customer.name}</p>
                    <p><strong>{translatedInfo["Contact Person"][props.language]}:</strong> {customer.contactPerson}</p>
                    <p><strong>{translatedInfo["Notes"][props.language]}:</strong> {customer.notes}</p>
                    {customer.imageUrl && (
                        <div>
                            <p><strong>{translatedInfo["Image"][props.language]}:</strong></p>
                            <img
                                className="details-image"
                                src={customer.imageUrl}
                                alt={customer.name}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <p>{translatedInfo["Loading"][props.language]}...</p>
            )}
        </div>
    );
}