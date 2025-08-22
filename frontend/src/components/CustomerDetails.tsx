import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import type {CustomerModel} from "./model/CustomerModel.ts";

type CustomerDetailsProps = {
    language: string;
}

export default function CustomerDetails(props: Readonly<CustomerDetailsProps>) {
    const [customer, setCustomer] = useState<CustomerModel | null>(null);
    const {id} = useParams<{id: string}>();

    useEffect(() => {
        if(!id) return;
        axios
            .get(`/api/customer/${id}`)
            .then((response) => setCustomer(response.data))
            .catch((error) => console.error("Error fetching customer details", error));
    }, [id]);



    return (
        <div>
            <h2>Customer Details</h2>
            <p>{props.language}</p>
        </div>
    );
}

type CustomerDetailsProps = {
    language: string;
}

export default function CustomerDetails(props: Readonly<CustomerDetailsProps>) {
    const [customer, setCustomer] = useState<CustomerModel | null>(null);
    const {id} = useParams<{id: string}>();

    useEffect(() => {
        if(!id) return;
        axios
            .get(`/api/customer/${id}`)
            .then((response) => setCustomer(response.data))
            .catch((error) => console.error("Error fetching customer details", error));
    })[id]



    return (
        <div>
            <h2>Customer Details</h2>
            <p>{props.language}</p>
        </div>
    );
}