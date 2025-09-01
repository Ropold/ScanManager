import type {ScannerModel} from "./model/ScannerModel.ts";
import type {CustomerModel} from "./model/CustomerModel.ts";
import type {ServicePartnerModel} from "./model/ServicePartnerModel.ts";

type ArchiveServicePartnersProps = {
    language: string;

    allActiveScanner: ScannerModel [];
    allActiveCustomer: CustomerModel[];

    allArchivedScanner: ScannerModel[];
    allArchivedCustomer: CustomerModel[];
    allArchivedServicePartner: ServicePartnerModel[];
}

export default function ArchiveServicePartners(props: Readonly<ArchiveServicePartnersProps>) {
    return (
        <div>
            <h2>Archive Service Partners</h2>
        </div>
    )
}