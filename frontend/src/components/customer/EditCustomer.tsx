import {type CustomerModel, DefaultCustomer} from "../model/CustomerModel.ts";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import CustomerForm from "./CustomerForm.tsx";
import {onFileChange, onImageCancel} from "../utils/ComponentsFunctions.ts";

type EditCustomerProps = {
    language: string;
    handleCustomerUpdate: (updatedCustomer: CustomerModel) => void;
}

export default function EditCustomer(props: Readonly<EditCustomerProps>) {
    const [customer, setCustomer] = useState<CustomerModel>(DefaultCustomer);
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();

    const [debitorNrNavision, setDebitorNrNavision] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [contactPerson, setContactPerson] = useState<string>("");
    const [contactDetails, setContactDetails] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [isArchived, setIsArchived] = useState<boolean>(false);

    const [image, setImage] = useState<File | null>(null);
    const [imageChanged, setImageChanged] = useState(false);
    const [imageDeleted, setImageDeleted] = useState(false);

    useEffect(() => {
        if(!id) return;
        axios
            .get(`/api/customers/${id}`)
            .then((response) => {
                const customer = response.data;
                setCustomer(customer);
                setDebitorNrNavision(customer.debitorNrNavision || "");
                setName(customer.name || "");
                setContactPerson(customer.contactPerson || "");
                setContactDetails(customer.contactDetails || "");
                setNotes(customer.notes || "");
                setIsArchived(customer.isArchived || false);
            })
            .catch((error) => console.error("Error fetching customer details", error));
    }, [id]);


    function handleSaveEdit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        if(!customer || customer === DefaultCustomer) return;

        // Image-URL Logik
        let updatedImageUrl = customer.imageUrl;
        if (imageChanged) {
            if (image) {
                updatedImageUrl = "temp-image"; // Backend ersetzt das mit echter URL
            } else if (imageDeleted) {
                updatedImageUrl = ""; // Image wurde gelöscht
            }
        }

        const updatedCustomerData = {
            debitorNrNavision,
            name,
            contactPerson,
            contactDetails,
            notes,
            imageUrl: updatedImageUrl,
            isArchived
        };

        const data = new FormData();
        if (imageChanged && image) {
            data.append("image", image);
        }
        data.append("customerModel", new Blob([JSON.stringify(updatedCustomerData)], { type: "application/json" }));

        axios
            .put(`/api/customers/${customer.id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
                props.handleCustomerUpdate(response.data);
                navigate(`/customers/${customer.id}`);
            })
            .catch((error) => {
                console.error("Error updating customer:", error);
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

    const backNavigationPath = customer?.id
        ? `/customers/${customer.id}`
        : "/customers";

    return(
        <>
            <h2>Edit Customer</h2>
            <CustomerForm
                language={props.language}
                backNavigationPath={backNavigationPath}
                debitorNrNavision={debitorNrNavision}
                setDebitorNrNavision={setDebitorNrNavision}
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
                existingImageUrl={customer.imageUrl}
            />
        </>
    );
}