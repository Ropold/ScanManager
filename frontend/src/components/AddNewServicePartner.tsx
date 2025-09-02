import type {ServicePartnerModel} from "./model/ServicePartnerModel.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {onFileChange, onImageCancel} from "./utils/ComponentsFunctions.ts";
import {translatedInfo} from "./utils/TranslatedInfo.ts";

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

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

    return (
        <div>
            <h2>Add New Service Partner</h2>

            <form onSubmit={handleSubmit}>
                <div className="edit-form">
                    <label>
                        {translatedInfo["creditorNrNavision"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={creditorNrNavision}
                            onChange={(e) => setCreditorNrNavision(e.target.value)}
                        />
                    </label>
                    <label>
                        {translatedInfo["servicePartnerName"][props.language]}:
                        <input
                            className="input-small"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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

                <button type="submit" className="button-blue margin-top-50">
                    {translatedInfo["Add Customer"][props.language]}
                </button>
                <button className="button-blue margin-left-20" onClick={()=> navigate("/service-partners")} >back</button>
            </form>
        </div>
    )
}