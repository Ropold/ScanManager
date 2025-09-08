import {useNavigate} from "react-router-dom";
import type {CustomerModel} from "../model/CustomerModel.ts";
import "../styles/CustomerCard.css"

type CustomerCardProps = {
    customer: CustomerModel;
    language: string;
}

export default function CustomerCard(props: Readonly<CustomerCardProps>) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/customers/${props.customer.id}`);
    }

    return(
        <div className="customer-card" onClick={handleCardClick}>
            <h2>{props.customer.name}</h2>
        </div>
    )
}