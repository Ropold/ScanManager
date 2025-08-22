import axios from "axios";
import type { UserModel } from "./components/model/UserModel.ts";
import type { ScannerModel } from "./components/model/ScannerModel.ts";
import type { CustomerModel } from "./components/model/CustomerModel.ts";
import type { ServicePartnerModel } from "./components/model/ServicePartnerModel.ts";


export function fetchUser(setUser: (user: string) => void) {
    axios.get("/api/users/me")
        .then((response) => {
            setUser(response.data.toString());
        })
        .catch((error) => {
            console.error(error);
            setUser("anonymousUser");
        });
}

export function fetchUserDetails(setUserDetails: (details: UserModel | null) => void) {
    axios.get("/api/users/me/details")
        .then((response) => {
            setUserDetails(response.data as UserModel);
        })
        .catch((error) => {
            console.error(error);
            setUserDetails(null);
        });
}

export function fetchAllScanner(setAllScanner: (scanners: ScannerModel[]) => void) {
    axios.get("/api/scanner")
        .then((response) => {
            setAllScanner(response.data as ScannerModel[]);
        })
        .catch((error) => {
            console.error("Error fetching scanners:", error);
        });
}

export function fetchAllCustomer(setAllCustomer: (customers: CustomerModel[]) => void) {
    axios.get("/api/customers")
        .then((response) => {
            setAllCustomer(response.data as CustomerModel[]);
        })
        .catch((error) => {
            console.error("Error fetching customers:", error);
        });
}

export function fetchAllServicePartner(setAllServicePartner: (partners: ServicePartnerModel[]) => void) {
    axios.get("/api/service-partner")
        .then((response) => {
            setAllServicePartner(response.data as ServicePartnerModel[]);
        })
        .catch((error) => {
            console.error("Error fetching service partners:", error);
        });
}

