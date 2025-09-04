import type {CustomerModel} from "./model/CustomerModel.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "./styles/AddNewDbRecord.css"
import {onFileChange, onImageCancel} from "./utils/ComponentsFunctions.ts";
import CustomerForm from "./CustomerForm.tsx";

type AddNewCustomerProps = {
    language: string;
    handleNewCustomerSubmit: (newCustomer: CustomerModel) => void;
}

export default function AddNewCustomer(props: Readonly<AddNewCustomerProps>) {

    const [debitorNrNavision, setDebitorNrNavision] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [contactPerson, setContactPerson] = useState<string>("");
    const [contactDetails, setContactDetails] = useState<string>("");
    const [notes, setNotes] = useState<string>("");

    const [image, setImage] = useState<File | null>(null);

    const navigate = useNavigate();

    function handleNewAddSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const customerData = {
            debitorNrNavision,
            name,
            contactPerson,
            contactDetails,
            notes,
        };

        const data = new FormData();

        if (image) {
            data.append("image", image);
        }

        data.append("customerModel", new Blob(
            [JSON.stringify(customerData)],
            {type: "application/json"}
        ));

        axios
            .post("/api/customers", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                props.handleNewCustomerSubmit(response.data);
                navigate(`/customers/${response.data.id}`);
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

    const backNavigationPath = "/customers";

    return (
        <div>
            <h2>Add New Customer Page</h2>
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
                handleSubmit={handleNewAddSubmit}
            />
        </div>
    )
}
