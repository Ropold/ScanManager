
export type CustomerModel = {
    id: string;
    debitorNrNavision?: string;
    name: string;
    contactPerson?: string;
    contactDetails?: string;
    notes?: string;
    imageUrl?: string;
    isArchived?: boolean;
}

export const DefaultCustomer: CustomerModel = {
    id: "0",
    debitorNrNavision: "",
    name: "Loading...",
    contactPerson: "Loading...",
    contactDetails: "Loading...",
    notes: "Loading...",
    imageUrl: "",
    isArchived: false
};