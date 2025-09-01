import type {ServicePartnerModel} from "./model/ServicePartnerModel.ts";

type AddNewServicePartnerProps = {
    language: string;
    handleNewServicePartnerSubmit: (newServicePartner: ServicePartnerModel) => void;
}

export default function AddNewServicePartner(props: Readonly<AddNewServicePartnerProps>) {
    return (
        <div>
            <h2>Add New Service Partner - To be implemented</h2>
        </div>
    )
}