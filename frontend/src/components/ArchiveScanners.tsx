import type {ScannerModel} from "./model/ScannerModel.ts";
import type {CustomerModel} from "./model/CustomerModel.ts";
import type {ServicePartnerModel} from "./model/ServicePartnerModel.ts";

type ArchivedScannerProps = {
    language: string;

    allActiveCustomer: CustomerModel[];
    allActiveServicePartner: ServicePartnerModel[];

    allArchivedScanner: ScannerModel[];
    allArchivedCustomer: CustomerModel[];
    allArchivedServicePartner: ServicePartnerModel[];
}

export default function ArchiveScanners(props: Readonly<ArchivedScannerProps>) {
    return (
        <div>
            <h2>Archive Scanner</h2>
        </div>
    )
}