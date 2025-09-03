import type {CustomerModel} from "./model/CustomerModel.ts";
import type {ServicePartnerModel} from "./model/ServicePartnerModel.ts";
import {DefaultScanner, type ScannerModel} from "./model/ScannerModel.ts";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

type EditScannerProps = {
    language: string;
    allActiveCustomer: CustomerModel[];
    allActiveServicePartner: ServicePartnerModel[];
    handleScannerUpdate:(scanner: ScannerModel) => void;
}

export default function EditScanner(props: Readonly<EditScannerProps>) {
    const [scanner, setScanner] = useState<ScannerModel>(DefaultScanner);
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();

    useEffect(() => {
        if(!id) return;
        axios
            .get(`/api/scanners/${id}`)
            .then((response) => setScanner(response.data))
            .catch((error) => console.error("Error fetching scanner details", error));
    }, [id]);

    function handleSubmit(){

    }

    return(
        <div>EditScanner</div>
    )
}