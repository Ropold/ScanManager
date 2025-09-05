import {translatedInfo} from "../utils/TranslatedInfo.ts";
import {useNavigate} from "react-router-dom";

type CustomerFormProps = {
    language: string;
    backNavigationPath: string;
    debitorNrNavision: string;
    setDebitorNrNavision: React.Dispatch<React.SetStateAction<string>>
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>
    contactPerson: string;
    setContactPerson: React.Dispatch<React.SetStateAction<string>>
    contactDetails: string;
    setContactDetails: React.Dispatch<React.SetStateAction<string>>
    notes: string;
    setNotes: React.Dispatch<React.SetStateAction<string>>
    image: File | null;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleImageCancel: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isArchived?: boolean;
    setIsArchived?: React.Dispatch<React.SetStateAction<boolean>>;
    imageChanged?: boolean;
    setImageChanged?: React.Dispatch<React.SetStateAction<boolean>>;
    imageDeleted?: boolean;
    setImageDeleted?: React.Dispatch<React.SetStateAction<boolean>>;
    existingImageUrl?: string;
}

export default function CustomerForm(props: Readonly<CustomerFormProps>) {

    const {
        backNavigationPath,
        debitorNrNavision,
        setDebitorNrNavision,
        name,
        setName,
        contactPerson,
        setContactPerson,
        contactDetails,
        setContactDetails,
        notes,
        setNotes,
        image,
        imageDeleted,
        existingImageUrl,
        isArchived,
        setIsArchived,
        handleFileChange,
        handleImageCancel,
        handleSubmit
    } = props;

    const navigate = useNavigate();

    const isEditMode = backNavigationPath.includes('/customers/') && backNavigationPath !== '/customers';

    function renderImagePreview() {
        if (image) {
            return (<img src={URL.createObjectURL(image)} alt="image-preview" className="image-preview" />);
        }
        if (existingImageUrl && !imageDeleted) {
            return (<img src={existingImageUrl} alt="existing-image" className="image-preview" />);
        }
        return null;
    }

    return(
        <div>
            <h2>Customer Form - To be implemented</h2>

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
                        <span>Image:</span>
                        <input type="file" onChange={handleFileChange} />
                    </label>

                    {/* Position 7 - Image */}
                    <div>
                        {renderImagePreview()}
                    </div>

                    {/* Position 8 - Button */}
                    <div>
                        {(image || (existingImageUrl && !imageDeleted)) && (
                            <button
                                type="button"
                                onClick={handleImageCancel}
                                className="button-blue button-remove-image"
                            >
                                {translatedInfo["Remove Image"][props.language]}
                            </button>
                        )}
                    </div>

                    <div>
                        {isArchived !== undefined && (
                            <label>
                                {translatedInfo["isArchived"][props.language]}:
                                <select
                                    className="input-small"
                                    value={isArchived ? "true" : "false"}
                                    onChange={(e) => setIsArchived?.(e.target.value === "true")}
                                >
                                    <option value="false">{translatedInfo["Active"][props.language]}</option>
                                    <option value="true">{translatedInfo["Archived"][props.language]}</option>
                                </select>
                            </label>
                        )}
                    </div>
                </div>

                <button type="submit" className="button-blue margin-top-50">
                    {isEditMode
                        ? translatedInfo["Update Customer"][props.language]
                        : translatedInfo["Add Customer"][props.language]
                    }
                </button>
                <button type="button" className="button-blue margin-left-20" onClick={() => navigate(backNavigationPath)}>
                    back
                </button>
            </form>
        </div>
    )
}