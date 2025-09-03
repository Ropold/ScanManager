import {type CustomerModel, DefaultCustomer} from "./model/CustomerModel.ts";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

type EditCustomerProps = {
    language: string;
    handleCustomerUpdate: (updatedCustomer: CustomerModel) => void;
}

export default function EditCustomer(props: Readonly<EditCustomerProps>) {
    const [customer, setCustomer] = useState<CustomerModel>(DefaultCustomer);
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();

    useEffect(() => {
        if(!id) return;
        axios
            .get(`/api/customers/${id}`)
            .then((response) => setCustomer(response.data))
            .catch((error) => console.error("Error fetching customer details", error));
    }, [id]);


    function handleSubmit(){

    }

    return(
        <>
        <div>EditServicePartner</div>
        </>
    )
}