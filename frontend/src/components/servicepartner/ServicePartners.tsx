import type {ServicePartnerModel} from "../model/ServicePartnerModel.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import SearchBar from "../SearchBar.tsx";
import ServicePartnerCard from "./ServicePartnerCard.tsx";

type ServicePartnerProps = {
    language: string;
    allActiveServicePartner: ServicePartnerModel[];
    allArchivedServicePartner: ServicePartnerModel[];
}

export default function ServicePartners(props: Readonly<ServicePartnerProps>) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredServicePartners, setFilteredServicePartners] = useState<ServicePartnerModel[]>([]);
    const [showArchived, setShowArchived] = useState<boolean>(false);

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

    const currentServicePartners = showArchived ? props.allArchivedServicePartner : props.allActiveServicePartner;

    useEffect(() => {
        const results = filterServicePartners(currentServicePartners, searchQuery);
        setFilteredServicePartners(results);
    }, [searchQuery, currentServicePartners]);

    return(
        <>

            <div className="add-new-button">
                <button className="button-blue" onClick={()=> navigate("add")}>add new SP</button>
                <button className="button-grey" onClick={() => setShowArchived(!showArchived)} >
                    {showArchived ? "Show Active SP" : "Show Archived SP"} </button>
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