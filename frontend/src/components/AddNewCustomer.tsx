import type {CustomerModel} from "./model/CustomerModel.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {translatedInfo} from "./utils/TranslatedInfo.ts";
import "./styles/AddNewDbRecord.css"
import {onFileChange, onImageCancel} from "./utils/ComponentsFunctions.ts";

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

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

    function cancelAndGoBack() {
        navigate("/customers");
        setDebitorNrNavision("");
        setName("");
        setContactPerson("");
        setContactDetails("");
        setNotes("");
        setImage(null)
    }

    return (
        <div>
            <h2>Add New Customer Page</h2>
            <form onSubmit={handleSubmit}>
                <div className="edit-form">
                    <label>
                        {translatedInfo["debitorNrNavision"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={debitorNrNavision}
                            onChange={(e)=> setDebitorNrNavision(e.target.value)}
                        />
                    </label>
                    <label>
                        {translatedInfo["customerName"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={name}
                            onChange={(e)=> setName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        {translatedInfo["contactPerson"][props.language]}:
                        <textarea
                            className="textarea-large"
                            value={contactPerson}
                            onChange={(e)=> setContactPerson(e.target.value)}
                        />
                    </label>
                    <label>
                        {translatedInfo["contactDetails"][props.language]}:
                        <textarea
                            className="textarea-large"
                            value={contactDetails}
                            onChange={(e)=> setContactDetails(e.target.value)}
                        />
                    </label>
                    <label>
                        {translatedInfo["notes"][props.language]}:
                        <textarea
                            className="textarea-large"
                            value={notes}
                            onChange={(e)=> setNotes(e.target.value)}
                        />
                    </label>

                    {/* Position 6 - Image Upload */}
                    <label>
                        Image:
                        <input type="file" onChange={handleFileChange} />
                    </label>

                    {/* Position 7 - Image */}
                    <div>
                        {image && (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="image-preview"
                                className="image-preview"
                            />
                        )}
                    </div>

                    {/* Position 8 - Button */}
                    <div>
                        {image && (
                            <button
                                type="button"
                                onClick={handleImageCancel}
                                className="button-blue button-remove-image"
                            >
                                {translatedInfo["Remove Image"][props.language]}
                            </button>
                        )}
                    </div>
                </div>
                <button type="submit" className="button-blue margin-top-50">{translatedInfo["Add Customer"][props.language]}</button>
                <button className="button-blue margin-left-20" onClick={cancelAndGoBack}>back</button>
            </form>
        </div>
    )
}
