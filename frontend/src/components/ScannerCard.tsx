import type {ScannerModel} from "./model/ScannerModel.ts";
import {useNavigate} from "react-router-dom";

type ScannerCardProps = {
    scanner: ScannerModel
    language: string
}

export default function ScannerCard(props: Readonly<ScannerCardProps>) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/scanner/${props.scanner.id}`);
    }

    return(
        <div className="scanner-card" onClick={handleCardClick}>
            <h2>{props.scanner.deviceName}</h2>
        </div>
    )
}