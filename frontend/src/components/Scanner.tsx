import type {ScannerModel} from "./model/ScannerModel.ts";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import SearchBar from "./SearchBar.tsx";
import ScannerCard from "./ScannerCard.tsx";

type ScannerProps = {
    language: string;
    allScanner: ScannerModel[]
}

export default function Scanner(props: Readonly<ScannerProps>) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredScanners, setFilteredScanners] = useState<ScannerModel[]>([]);

    const location = useLocation();
    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

    function filterScanners(scanners: ScannerModel[], query: string): ScannerModel[] {
        const searchQuery = query.toLowerCase();

        return scanners.filter(scanner => {
            const deviceName = scanner.deviceName?.toLowerCase() || "";
            const serialNumber = scanner.serialNumber?.toLowerCase() || "";
            const contractNumber = scanner.contractNumber?.toLowerCase() || "";
            const invoiceNumber = scanner.invoiceNumber?.toLowerCase() || "";
            const maintenanceContent = scanner.maintenanceContent?.toLowerCase() || "";
            const note = scanner.note?.toLowerCase() || "";
            const id = scanner.id.toLowerCase();
            const customerId = scanner.customerId.toLowerCase();
            const servicePartnerId = scanner.servicePartnerId.toLowerCase();
            const contractType = scanner.contractType.toString().toLowerCase();
            const status = scanner.status.toString().toLowerCase();
            const purchasePrice = scanner.purchasePrice?.toString() || "";
            const salePrice = scanner.salePrice?.toString() || "";
            const depreciation = scanner.depreciation?.toString() || "";
            const startDate = scanner.startDate || "";
            const endDate = scanner.endDate || "";

            return (
                id.includes(searchQuery) ||
                customerId.includes(searchQuery) ||
                servicePartnerId.includes(searchQuery) ||
                deviceName.includes(searchQuery) ||
                serialNumber.includes(searchQuery) ||
                contractNumber.includes(searchQuery) ||
                invoiceNumber.includes(searchQuery) ||
                contractType.includes(searchQuery) ||
                status.includes(searchQuery) ||
                maintenanceContent.includes(searchQuery) ||
                note.includes(searchQuery) ||
                purchasePrice.includes(searchQuery) ||
                salePrice.includes(searchQuery) ||
                depreciation.includes(searchQuery) ||
                startDate.includes(searchQuery) ||
                endDate.includes(searchQuery)
            );
        });
    }

    useEffect(() => {
        setFilteredScanners(filterScanners(props.allScanner, searchQuery));
    }, [props.allScanner, searchQuery]);
    return(
        <>
        <h2>Scanner</h2>
        <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        />
        <div className="scanner-card-container">
            {filteredScanners.map((s: ScannerModel) => (
                <ScannerCard
                    key={s.id}
                    scanner={s}
                    language={props.language}
                />
            ))}
        </div>

        </>
    )
}