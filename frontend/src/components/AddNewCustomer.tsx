import type {CustomerModel} from "./model/CustomerModel.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {translatedInfo} from "./utils/TranslatedInfo.ts";
import "./styles/AddNewDbRecord.css"

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

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const file = e.target.files[0];
            setImage(file);
        }
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

                    <div className="margin-top-20">
                        <label>
                            Image:
                            <input type="file" onChange={onFileChange} />
                            {image && (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={"image-preview"}
                                    className="image-preview"
                                />
                            )}
                        </label>
                    </div>

                     <label>
                          <button type="submit" className="button-blue margin-top-50">{translatedInfo["Add Customer"][props.language]}</button>
                   </label>
                </div>
            </form>
        </div>
    )
}
