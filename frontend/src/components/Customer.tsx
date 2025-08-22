import SearchBar from "./SearchBar.tsx";
import type {CustomerModel} from "./model/CustomerModel.ts";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import CustomerCard from "./CustomerCard.tsx";

type CustomerProps = {
    language: string;
    allCustomer: CustomerModel[];
}

export default function Customer(props: Readonly<CustomerProps>) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredCustomers, setFilteredCustomers] = useState<CustomerModel[]>([]);

    const location = useLocation();

    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

    function filterCustomers(customers: CustomerModel[], query: string): CustomerModel[] {
        const searchQuery = query.toLowerCase();

        return customers.filter(customer => {
            const name = customer.name.toLowerCase();
            const contactPerson = customer.contactPerson.toLowerCase();
            const notes = customer.notes.toLowerCase();
            return (
                name.includes(searchQuery) ||
                contactPerson.includes(searchQuery) ||
                notes.includes(searchQuery)
            );
        });
    }

    useEffect(() => {
        setFilteredCustomers(filterCustomers(props.allCustomer, searchQuery));
    }, [props.allCustomer, searchQuery]);

    return (
        <>
        <h2>Customers</h2>

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