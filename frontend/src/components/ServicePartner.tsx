import type {ServicePartnerModel} from "./model/ServicePartnerModel.ts";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import SearchBar from "./SearchBar.tsx";
import ServicePartnerCard from "./ServicePartnerCard.tsx";

type ServicePartnerProps = {
    language: string;
    allServicePartner: ServicePartnerModel[];
}

export default function ServicePartner(props: Readonly<ServicePartnerProps>) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredServicePartners, setFilteredServicePartners] = useState<ServicePartnerModel[]>([]);

    const location = useLocation();

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
        <h2>Service Partners</h2>

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