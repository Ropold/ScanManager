export type ServicePartnerModel = {
    id: string;
    creditorNrNavision?: string;
    name: string;
    contactPerson?: string;
    contactDetails?: string;
    notes?: string;
    imageUrl?: string;
    isArchived: boolean;
}

export const DefaultServicePartner: ServicePartnerModel = {
    id: "0",
    creditorNrNavision: "",
    name: "Loading...",
    contactPerson: "Loading...",
    contactDetails: "Loading...",
    notes: "Loading...",
    imageUrl: "",
    isArchived: false
};