import SearchBar from "./SearchBar.tsx";
import type {CustomerModel} from "./model/CustomerModel.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import CustomerCard from "./CustomerCard.tsx";

type CustomerProps = {
    language: string;
    allActiveCustomer: CustomerModel[];
}

export default function Customers(props: Readonly<CustomerProps>) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredCustomers, setFilteredCustomers] = useState<CustomerModel[]>([]);

    const location = useLocation();

    const navigate = useNavigate();

    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

    function filterCustomers(customers: CustomerModel[], query: string): CustomerModel[] {
        const searchQuery = query.toLowerCase();

        return customers.filter(customer => {
            const id = customer.id.toLowerCase();
            const debitorNrNavision = customer.debitorNrNavision?.toLowerCase() || "";
            const name = customer.name.toLowerCase();
            const contactPerson = customer.contactPerson?.toLowerCase() || "";
            const contactDetails = customer.contactDetails?.toLowerCase() || "";
            const notes = customer.notes?.toLowerCase() || "";
            const isArchived = customer.isArchived?.toString() || "";

            return (
                id.includes(searchQuery) ||
                debitorNrNavision.includes(searchQuery) ||
                name.includes(searchQuery) ||
                contactPerson.includes(searchQuery) ||
                contactDetails.includes(searchQuery) ||
                notes.includes(searchQuery) ||
                isArchived.includes(searchQuery)
            );
        });
    }

    useEffect(() => {
        setFilteredCustomers(filterCustomers(props.allActiveCustomer, searchQuery));
    }, [props.allActiveCustomer, searchQuery]);

    return (
        <>
            <div className="add-new-button">
                <button className="button-blue" onClick={()=> navigate("add")}>add new Customer</button>
                <button className="button-grey" onClick={()=> navigate("archive")}>Archive Customers</button>
            </div>
        <SearchBar
           searchQuery={searchQuery}
           setSearchQuery={setSearchQuery}
        />

        <div className="customer-card-container">
            {filteredCustomers.map((c: CustomerModel) => (

                <CustomerCard
                key={c.id}
                customer={c}
                language={props.language}
                />
            ))}

        </div>
        </>
    )
}