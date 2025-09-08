import type {ScannerModel} from "../model/ScannerModel.ts";
import {useNavigate} from "react-router-dom";
import "../styles/ScannerCard.css"
import {translatedInfo} from "../utils/TranslatedInfo.ts";
import {formatDate} from "../utils/ComponentsFunctions.ts";

type ScannerCardProps = {
    scanner: ScannerModel;
    customerName?: string;
    servicePartnerName?: string;
    language: string;
}

export default function ScannerCard(props: Readonly<ScannerCardProps>) {
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate(`/scanners/${props.scanner.id}`);
    }

    const customerName = props.customerName || "—";
    const servicePartnerName = props.servicePartnerName || "—";

    return(
        <div className="scanner-card" onClick={handleCardClick}>
            <div className="scanner-card-section">
                <p><strong>{translatedInfo["modelName"][props.language]}:</strong> {props.scanner.modelName || "—"}</p>
                <p><strong>{translatedInfo["serialNumber"][props.language]}:</strong> {props.scanner.serialNumber || "—"}</p>
                <p><strong>{translatedInfo["customerName"][props.language]}:</strong> {customerName}</p>
                <p><strong>{translatedInfo["scannerNrNavision"][props.language]}:</strong> {props.scanner.scannerNrNavision}</p>
                <p><strong>{translatedInfo["startDate"][props.language]}:</strong> {formatDate(props.scanner.startDate)}</p>
                <p><strong>{translatedInfo["endDate"][props.language]}:</strong> {formatDate(props.scanner.endDate)}</p>
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