import type {ServicePartnerModel} from "./model/ServicePartnerModel.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import SearchBar from "./SearchBar.tsx";
import ServicePartnerCard from "./ServicePartnerCard.tsx";
import type {ScannerModel} from "./model/ScannerModel.ts";
import type {CustomerModel} from "./model/CustomerModel.ts";

type ServicePartnerProps = {
    language: string;
    allActiveScanner: ScannerModel [];
    allActiveCustomer: CustomerModel[];
    allActiveServicePartner: ServicePartnerModel[];

    allArchivedScanner: ScannerModel[];
    allArchivedCustomer: CustomerModel[];
    allArchivedServicePartner: ServicePartnerModel[];
}

export default function ServicePartners(props: Readonly<ServicePartnerProps>) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredServicePartners, setFilteredServicePartners] = useState<ServicePartnerModel[]>([]);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

    function filterServicePartners(servicePartners: ServicePartnerModel[], query: string): ServicePartnerModel[] {
        const searchQuery = query.toLowerCase();

        return servicePartners.filter(servicePartner => {
            const id = servicePartner.id.toLowerCase();
            const creditorNrNavision= servicePartner.creditorNrNavision?.toLowerCase() || "";
            const name = servicePartner.name?.toLowerCase() || "";
            const contactPerson = servicePartner.contactPerson?.toLowerCase() || "";
            const contactDetails= servicePartner.contactDetails?.toLowerCase() || "";
            const notes = servicePartner.notes?.toLowerCase() || "";

            return (
                id.includes(searchQuery) ||
                creditorNrNavision.includes(searchQuery) ||
                contactPerson.includes(searchQuery) ||
                contactDetails.includes(searchQuery) ||
                notes.includes(searchQuery) ||
                name.includes(searchQuery)
            );
        });
    }

    useEffect(() => {
        setFilteredServicePartners(filterServicePartners(props.allServicePartner, searchQuery));
    }, [props.allServicePartner, searchQuery]);

    return(
        <>

            <div className="add-new-button">
                <button className="button-blue" onClick={()=> navigate("add")}>add new SP</button>
                <button className="button-grey" onClick={()=> navigate("archive")}>Archive SP</button>
            </div>
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <div className="service-partner-card-container">
                {filteredServicePartners.map((sp: ServicePartnerModel) => (
                    <ServicePartnerCard
                        key={sp.id}
                        servicePartner={sp}
                        language={props.language}
                    />
                ))}
            </div>
        </>
    )
}