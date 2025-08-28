import type {ServicePartnerModel} from "./model/ServicePartnerModel.ts";
import {useNavigate} from "react-router-dom";

type ServicePartnerCardProps = {
    servicePartner: ServicePartnerModel;
    language: string;
}

export default function ServicePartnerCard(props: Readonly<ServicePartnerCardProps>) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/service-partners/${props.servicePartner.id}`);
    }

    return (
        <div className="service-partner-card" onClick={handleCardClick}>
            <h2>{props.servicePartner.name}</h2>
        </div>
    )
}