import {useNavigate} from "react-router-dom";

type ServicePartnerProps = {
    language: string;
    backNavigationPath: string;
    creditorNrNavision: string;
    setCreditorNrNavision: React.Dispatch<React.SetStateAction<string>>
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
}

export default function ServicePartnerForm(props: Readonly<ServicePartnerProps>) {

    const {
        creditorNrNavision,
        setCreditorNrNavision,
        name,
        setName,
        contactPerson,
        setContactPerson,
        contactDetails,
        setContactDetails,
        notes,
        setNotes,
        image,
        handleFileChange,
        handleImageCancel,
        handleSubmit
    } = props;

    const navigate = useNavigate();

    return (
        <div>ServicePartnerForm</div>
    )
}