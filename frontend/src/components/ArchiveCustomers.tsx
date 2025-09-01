import type {ScannerModel} from "./model/ScannerModel.ts";
import type {CustomerModel} from "./model/CustomerModel.ts";
import type {ServicePartnerModel} from "./model/ServicePartnerModel.ts";

type ArchiveCustomersProps = {
    language: string;

    allActiveScanner: ScannerModel [];
    allActiveServicePartner: ServicePartnerModel[];

    allArchivedScanner: ScannerModel[];
    allArchivedCustomer: CustomerModel[];
    allArchivedServicePartner: ServicePartnerModel[];
}

export default function ArchiveCustomers(props: Readonly<ArchiveCustomersProps>) {
    return (
        <div>
            <h2>Archive Customers</h2>
        </div>
    )
}