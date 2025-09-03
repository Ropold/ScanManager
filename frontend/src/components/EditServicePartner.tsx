import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {DefaultServicePartner, type ServicePartnerModel} from "./model/ServicePartnerModel.ts";
import axios from "axios";

type EditServicePartnerProps = {
    language: string;
    handleServicePartnerUpdate: (updatedServicePartner: ServicePartnerModel) => void;
}

export default function EditServicePartner(props: Readonly<EditServicePartnerProps>) {
    const [servicePartner, setServicePartner] = useState<ServicePartnerModel>(DefaultServicePartner);
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();

    useEffect(() => {
        if(!id) return;
        axios
            .get(`/api/service-partners/${id}`)
            .then((response) => setServicePartner(response.data))
            .catch((error) => console.error("Error fetching service partner details", error));
    }, [id]);

    function handleSubmit(){

    }

    return(
        <div>EditServicePartner</div>
    )
}