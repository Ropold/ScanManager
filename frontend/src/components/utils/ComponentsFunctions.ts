import type {ServicePartnerModel} from "../model/ServicePartnerModel.ts";
import type {CustomerModel} from "../model/CustomerModel.ts";
import {useEffect} from "react";
import {useLocation} from "react-router-dom";

export function onFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (file: File | null) => void
) {
    if (e.target.files) {
        const file = e.target.files[0];
        setImage(file);
    }
}

export function onImageCancel(setImage: (file: File | null) => void) {
    setImage(null);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
}

export function getCustomerName(
    customerId: string | undefined,
    allActiveCustomer: CustomerModel[],
    allArchivedCustomer: CustomerModel[]
) {
    if (!customerId) return undefined;
    const allCustomers = [...allActiveCustomer, ...allArchivedCustomer];
    return allCustomers.find(customer => customer.id === customerId)?.name;
}

export function getServicePartnerName(
    servicePartnerId: string | undefined,
    allActiveServicePartner: ServicePartnerModel[],
    allArchivedServicePartner: ServicePartnerModel[]
) {
    if (!servicePartnerId) return undefined;
    const allServicePartners = [...allActiveServicePartner, ...allArchivedServicePartner];
    return allServicePartners.find(sp => sp.id === servicePartnerId)?.name;
}

export function formatDate(dateString: string | undefined): string {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('de-DE');
}

export const useAutoScrollToTop = () => {
    const location = useLocation();
    useEffect(() => window.scroll(0, 0), [location]);
};