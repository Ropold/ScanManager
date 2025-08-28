import type {ScannerModel} from "./model/ScannerModel.ts";
import {useNavigate} from "react-router-dom";
import "./styles/ScannerCard.css"
import {translatedInfo} from "./utils/TranslatedInfo.ts";
import type {CustomerModel} from "./model/CustomerModel.ts";
import type {ServicePartnerModel} from "./model/ServicePartnerModel.ts";

type ScannerCardProps = {
    scanner: ScannerModel
    allCustomer: CustomerModel[]
    allServicePartner: ServicePartnerModel[];
    language: string
}

export default function ScannerCard(props: Readonly<ScannerCardProps>) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/scanners/${props.scanner.id}`);
    }

    const customerName = props.allCustomer.find(
        customer => customer.id === props.scanner.customerId
    )?.name || "—";

    const servicePartnerName = props.allServicePartner.find(
        sp => sp.id === props.scanner.servicePartnerId
    )?.name || "—";

    return(
        <div className="scanner-card" onClick={handleCardClick}>
            <div className="scanner-card-section">
                <p><strong>{translatedInfo["modelName"][props.language]}:</strong> {props.scanner.modelName || "—"}</p>
                <p><strong>{translatedInfo["serialNumber"][props.language]}:</strong> {props.scanner.serialNumber || "—"}</p>
                <p><strong>{translatedInfo["customerName"][props.language]}:</strong> {customerName}</p>
                <p><strong>{translatedInfo["startDate"][props.language]}:</strong> {props.scanner.startDate || "—"}</p>
                <p><strong>{translatedInfo["endDate"][props.language]}:</strong> {props.scanner.endDate || "—"}</p>
                <p><strong>{translatedInfo["status"][props.language]}:</strong> {props.scanner.status}</p>

            </div>
            <div className="scanner-card-section">
                <p><strong>{translatedInfo["locationAddress"][props.language]}:</strong> {props.scanner.locationAddress || "—"}</p>
                <p><strong>{translatedInfo["servicePartnerName"][props.language]}:</strong> {servicePartnerName}</p>
                <p><strong>{translatedInfo["contactPersonDetails"][props.language]}:</strong> {props.scanner.contactPersonDetails || "—"}</p>
                <p><strong>{translatedInfo["slaMaintenance"][props.language]}:</strong> {props.scanner.slaMaintenance || "—"}</p>
            </div>
        </div>
    )
}