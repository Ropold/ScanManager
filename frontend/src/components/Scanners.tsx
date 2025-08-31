import type {ScannerModel} from "./model/ScannerModel.ts";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import SearchBar from "./SearchBar.tsx";
import ScannerCard from "./ScannerCard.tsx";
import type {CustomerModel} from "./model/CustomerModel.ts";
import type {ServicePartnerModel} from "./model/ServicePartnerModel.ts";

type ScannerProps = {
    language: string;
    allScanner: ScannerModel[]
    allCustomer: CustomerModel[];
    allServicePartner: ServicePartnerModel[];
}

export default function Scanners(props: Readonly<ScannerProps>) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredScanners, setFilteredScanners] = useState<ScannerModel[]>([]);

    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

    function filterScanners(scanners: ScannerModel[], query: string): ScannerModel[] {
        const searchQuery = query.toLowerCase();

        return scanners.filter(scanner => {
            const id = scanner.id.toLowerCase();
            const customerId = scanner.customerId?.toLowerCase() || "";
            const servicePartnerId = scanner.servicePartnerId?.toLowerCase() || "";
            const modelName = scanner.modelName?.toLowerCase() || "";
            const manufacturerCode = scanner.manufacturerCode?.toLowerCase() || "";
            const serialNumber = scanner.serialNumber?.toLowerCase() || "";
            const scannerNrNavision = scanner.scannerNrNavision?.toLowerCase() || "";
            const contractNumber = scanner.contractNumber?.toLowerCase() || "";
            const startDate = scanner.startDate || "";
            const endDate = scanner.endDate || "";
            const slaMaintenance = scanner.slaMaintenance?.toLowerCase() || "";
            const locationAddress = scanner.locationAddress?.toLowerCase() || "";
            const contactPersonDetails = scanner.contactPersonDetails?.toLowerCase() || "";
            const acquisitionDate = scanner.acquisitionDate || "";
            const purchasedBy = scanner.purchasedBy?.toLowerCase() || "";
            const deviceType = scanner.deviceType?.toString().toLowerCase() || "";
            const contractType = scanner.contractType?.toString().toLowerCase() || "";
            const status = scanner.status?.toString().toLowerCase() || "";
            const purchasePrice = scanner.purchasePrice?.toString() || "";
            const salePrice = scanner.salePrice?.toString() || "";
            const depreciation = scanner.depreciation?.toString() || "";
            const notes = scanner.notes?.toLowerCase() || "";
            const isArchived = scanner.isArchived?.toString() || "";

            return (
                id.includes(searchQuery) ||
                customerId.includes(searchQuery) ||
                servicePartnerId.includes(searchQuery) ||
                modelName.includes(searchQuery) ||
                manufacturerCode.includes(searchQuery) ||
                serialNumber.includes(searchQuery) ||
                scannerNrNavision.includes(searchQuery) ||
                contractNumber.includes(searchQuery) ||
                startDate.includes(searchQuery) ||
                endDate.includes(searchQuery) ||
                slaMaintenance.includes(searchQuery) ||
                locationAddress.includes(searchQuery) ||
                contactPersonDetails.includes(searchQuery) ||
                acquisitionDate.includes(searchQuery) ||
                purchasedBy.includes(searchQuery) ||
                deviceType.includes(searchQuery) ||
                contractType.includes(searchQuery) ||
                status.includes(searchQuery) ||
                purchasePrice.includes(searchQuery) ||
                salePrice.includes(searchQuery) ||
                depreciation.includes(searchQuery) ||
                notes.includes(searchQuery) ||
                isArchived.includes(searchQuery)
            );
        });
    }

    useEffect(() => {
        setFilteredScanners(filterScanners(props.allScanner, searchQuery));
    }, [props.allScanner, searchQuery]);

    return(
        <>

            <div className="add-new-button">
                <button className="button-blue" onClick={()=> navigate("add")}>add new Scanner</button>
                <button className="button-grey" onClick={()=> navigate("archive")}>Archive Scanners</button>
            </div>
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <div className="scanner-card-container">
                {filteredScanners.map((s: ScannerModel) => (
                    <ScannerCard
                        key={s.id}
                        scanner={s}
                        allCustomer={props.allCustomer}
                        allServicePartner={props.allServicePartner}
                        language={props.language}
                    />
                ))}
            </div>

        </>
    )
}