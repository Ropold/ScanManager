
export type ServicePartnerModel = {
    id: string;
    name: string;
    contactPerson: string;
    notes: string;
    imageUrl: string;
}

export const DefaultServicePartner: ServicePartnerModel = {
    id: "0",
    name: "Loading...",
    contactPerson: "Loading...",
    notes: "Loading...",
    imageUrl: ""
};