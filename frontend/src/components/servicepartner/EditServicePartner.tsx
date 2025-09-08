import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {DefaultServicePartner, type ServicePartnerModel} from "../model/ServicePartnerModel.ts";
import axios from "axios";
import {onFileChange, onImageCancel} from "../utils/ComponentsFunctions.ts";
import ServicePartnerForm from "./ServicePartnerForm.tsx";

type EditServicePartnerProps = {
    language: string;
    handleServicePartnerUpdate: (updatedServicePartner: ServicePartnerModel) => void;
}
export default function EditServicePartner(props: Readonly<EditServicePartnerProps>) {
    const [servicePartner, setServicePartner] = useState<ServicePartnerModel>(DefaultServicePartner);
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [creditorNrNavision, setCreditorNrNavision] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [contactPerson, setContactPerson] = useState<string>("");
    const [contactDetails, setContactDetails] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [isArchived, setIsArchived] = useState<boolean>(false);

    const [image, setImage] = useState<File | null>(null);
    const [imageChanged, setImageChanged] = useState(false);
    const [imageDeleted, setImageDeleted] = useState(false);

    useEffect(() => {
        if (!id) return;
        axios
            .get(`/api/service-partners/${id}`)
            .then((response) => {
                const servicePartner = response.data;
                setServicePartner(servicePartner);
                setCreditorNrNavision(servicePartner.creditorNrNavision || "");
                setName(servicePartner.name || "");
                setContactPerson(servicePartner.contactPerson || "");
                setContactDetails(servicePartner.contactDetails || "");
                setNotes(servicePartner.notes || "");
                setIsArchived(servicePartner.isArchived || false);
            })
            .catch((error) => console.error("Error fetching service partner details", error));
    }, [id]);

    function handleSaveEdit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!servicePartner || servicePartner === DefaultServicePartner) return;

        let updatedImageUrl = servicePartner.imageUrl;
        if (imageChanged) {
            if (image) {
                updatedImageUrl = "temp-image";
            } else if (imageDeleted) {
                updatedImageUrl = "";
            }
        }

        const updatedServicePartner = {
            creditorNrNavision,
            name,
            contactPerson,
            contactDetails,
            notes,
            imageUrl: updatedImageUrl,
            isArchived,
        };

        const data = new FormData();
        if (imageChanged && image) {
            data.append("image", image);
        }
        data.append("servicePartnerModel", new Blob([JSON.stringify(updatedServicePartner)], {type: "application/json"}));

        axios
            .put(`/api/service-partners/${servicePartner.id}`, data, {
                headers: {"Content-Type": "multipart/form-data"},
            })
            .then((response) => {
                props.handleServicePartnerUpdate(response.data);
                navigate(`/service-partners/${servicePartner.id}`);
            })
            .catch((error) => {
                console.error("Error updating service partner:", error);
                alert("An unexpected error occurred. Please try again.");
            });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFileChange(e, setImage);
        setImageChanged(true);
    };

    const handleImageCancel = () => {
        onImageCancel(setImage);
        setImageChanged(true);
        setImageDeleted(true);
    };

    const backNavigationPath = servicePartner?.id
        ? `/service-partners/${servicePartner.id}`
        : "/service-partners";

    return(
        <>
        <div>EditServicePartner</div>
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
            handleSubmit={handleSaveEdit}
            isArchived={isArchived}
            setIsArchived={setIsArchived}
            imageChanged={imageChanged}
            setImageChanged={setImageChanged}
            imageDeleted={imageDeleted}
            setImageDeleted={setImageDeleted}
            existingImageUrl={servicePartner.imageUrl}
        />
        </>
    )
}