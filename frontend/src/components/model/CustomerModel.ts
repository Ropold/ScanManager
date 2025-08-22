
export type CustomerModel = {
    id: string;
    name: string;
    contactPerson: string;
    notes: string;
    imageUrl: string;
}

export const DefaultCustomer: CustomerModel = {
    id: "0",
    name: "Loading...",
    contactPerson: "Loading...",
    notes: "Loading...",
    imageUrl: ""
};