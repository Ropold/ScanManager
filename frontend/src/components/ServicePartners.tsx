import type {ServicePartnerModel} from "./model/ServicePartnerModel.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import SearchBar from "./SearchBar.tsx";
import ServicePartnerCard from "./ServicePartnerCard.tsx";

type ServicePartnerProps = {
    language: string;
    allActiveServicePartner: ServicePartnerModel[];
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
        setFilteredServicePartners(filterServicePartners(props.allActiveServicePartner, searchQuery));
    }, [props.allActiveServicePartner, searchQuery]);

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