import type {ServicePartnerModel} from "../model/ServicePartnerModel.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {onFileChange, onImageCancel} from "../utils/ComponentsFunctions.ts";
import ServicePartnerForm from "./ServicePartnerForm.tsx";

type AddNewServicePartnerProps = {
    language: string;
    handleNewServicePartnerSubmit: (newServicePartner: ServicePartnerModel) => void;
}

export default function AddNewServicePartner(props: Readonly<AddNewServicePartnerProps>) {

    const [creditorNrNavision, setCreditorNrNavision] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [contactPerson, setContactPerson] = useState<string>("");
    const [contactDetails, setContactDetails] = useState<string>("");
    const [notes, setNotes] = useState<string>("");

    const [image, setImage] = useState<File | null>(null);

    const navigate = useNavigate();

    function handleNewAddSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const servicePartnerData = {
            creditorNrNavision,
            name,
            contactPerson,
            contactDetails,
            notes,
        }

        const data = new FormData();

        if (image) {
            data.append("image", image);
        }

        data.append("servicePartnerModel", new Blob(
            [JSON.stringify(servicePartnerData)],
            {type: "application/json"}
        ));

        axios
            .post("/api/service-partners", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                props.handleNewServicePartnerSubmit(response.data);
                navigate(`/service-partners/${response.data.id}`);
            })
            .catch((error) => {
                alert("An unexpected error occurred. Please try again.");
                console.error(error);
            });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFileChange(e, setImage);
    };

    const handleImageCancel = () => {
        onImageCancel(setImage);
    };

    const backNavigationPath = "/service-partners";

    return (
        <div>
            <h2>Add New Service Partner</h2>

            <ServicePartnerForm
                language={props.language}
                backNavigationPath={backNavigationPath}
                creditorNrNavision={creditorNrNavision}
                setCreditorNrNavision={setCreditorNrNavision}
                name={name}
                setName={setName}
                contactPerson={contactPerson}
                setContactPerson={setContactPerson}
                contactDetails={contactDetails}
                setContactDetails={setContactDetails}
                notes={notes}
                setNotes={setNotes}
                image={image}
                handleFileChange={handleFileChange}
                handleImageCancel={handleImageCancel}
                handleSubmit={handleNewAddSubmit}
            />

        </div>
    )
}