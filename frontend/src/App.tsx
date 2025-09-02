import './App.css'
import {useEffect, useState} from "react";
import Welcome from "./components/Welcome.tsx";
import NotFound from "./components/NotFound.tsx";
import {Route, Routes} from "react-router-dom";
import Footer from "./components/Footer.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Profile from "./components/Profile.tsx";
import NavBar from "./components/NavBar.tsx";
import {DefaultUser, type UserModel} from "./components/model/UserModel.ts";
import Scanners from "./components/Scanners.tsx";
import Customers from "./components/Customers.tsx";
import ServicePartners from "./components/ServicePartners.tsx";
import type {CustomerModel} from "./components/model/CustomerModel.ts";
import type {ServicePartnerModel} from "./components/model/ServicePartnerModel.ts";
import type {ScannerModel} from "./components/model/ScannerModel.ts";

import {
    fetchUser,
    fetchUserDetails,
    fetchAllScanner,
    fetchAllCustomer,
    fetchAllServicePartner, fetchAllArchivedScanner, fetchAllArchivedCustomer, fetchAllArchivedServicePartner
} from "./App-Functions.ts";
import CustomerDetails from "./components/CustomerDetails.tsx";
import ScannerDetails from "./components/ScannerDetails.tsx";
import ServicePartnerDetails from "./components/ServicePartnerDetails.tsx";
import AddNewScanner from "./components/AddNewScanner.tsx";
import AddNewCustomer from "./components/AddNewCustomer.tsx";
import AddNewServicePartner from "./components/AddNewServicePartner.tsx";
import ArchiveScanners from "./components/ArchiveScanners.tsx";
import ArchiveCustomers from "./components/ArchiveCustomers.tsx";
import ArchiveServicePartners from "./components/ArchiveServicePartners.tsx";


export default function App() {
    const [user, setUser] = useState<string>("anonymousUser");
    const [userDetails, setUserDetails] = useState<UserModel | null>(DefaultUser);
    const [language, setLanguage] = useState<string>("de");

    const [allActiveScanner, setAllActiveScanner] = useState<ScannerModel[]>([]);
    const [allActiveCustomer, setAllActiveCustomer]= useState<CustomerModel[]>([]);
    const [allActiveServicePartner, setAllActiveServicePartner] = useState<ServicePartnerModel[]>([]);

    const [allArchivedScanner, setAllArchivedScanner] = useState<ScannerModel[]>([]);
    const [allArchivedCustomer, setAllArchivedCustomer]= useState<CustomerModel[]>([]);
    const [allArchivedServicePartner, setAllArchivedServicePartner] = useState<ServicePartnerModel[]>([]);


    function getUser() {
        fetchUser(setUser);
    }

    function getUserDetails() {
        fetchUserDetails(setUserDetails);
    }

    function getAllActiveScanner() {
        fetchAllScanner(setAllActiveScanner);
    }
    function getAllActiveCustomer() {
        fetchAllCustomer(setAllActiveCustomer);
    }
    function getAllActiveServicePartner() {
        fetchAllServicePartner(setAllActiveServicePartner);
    }

    function getAllArchivedScanner() {
        fetchAllArchivedScanner(setAllArchivedScanner);
    }
    function getAllArchivedCustomer() {
        fetchAllArchivedCustomer(setAllArchivedCustomer);
    }
    function getAllArchivedServicePartner() {
        fetchAllArchivedServicePartner(setAllArchivedServicePartner);
    }

    function handleNewScannerSubmit(newScanner: ScannerModel) {
        setAllActiveScanner(prevScanners => [...prevScanners, newScanner]);
    }
    function handleNewCustomerSubmit(newCustomer: CustomerModel) {
        setAllActiveCustomer(prevCustomers => [...prevCustomers, newCustomer]);
    }
    function handleNewServicePartnerSubmit(newServicePartner: ServicePartnerModel) {
        setAllActiveServicePartner(prevServicePartners => [...prevServicePartners, newServicePartner]);
    }

    function handleScannerDelete(deletedScannerId: string) {
        setAllActiveScanner(prevScanners =>
            prevScanners.filter(scanner => scanner.id !== deletedScannerId)
        );
        setAllArchivedScanner(prevScanners =>
            prevScanners.filter(scanner => scanner.id !== deletedScannerId)
        );
    }
    function handleCustomerDelete(deletedCustomerId: string) {
        setAllActiveCustomer(prevCustomers =>
            prevCustomers.filter(customer => customer.id !== deletedCustomerId)
        );
        setAllArchivedCustomer(prevCustomers =>
            prevCustomers.filter(customer => customer.id !== deletedCustomerId)
        );
    }
    function handleServicePartnerDelete(deletedServicePartnerId: string) {
        setAllActiveServicePartner(prevServicePartners =>
            prevServicePartners.filter(sp => sp.id !== deletedServicePartnerId)
        );
        setAllArchivedServicePartner(prevServicePartners =>
            prevServicePartners.filter(sp => sp.id !== deletedServicePartnerId)
        );
    }

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if(user !== "anonymousUser"){
            getUserDetails();
            getAllActiveScanner();
            getAllActiveCustomer();
            getAllActiveServicePartner();
            getAllArchivedScanner();
            getAllArchivedCustomer();
            getAllArchivedServicePartner();
        }
    }, [user]);

    useEffect(() => {
        setLanguage(userDetails?.preferredLanguage ?? "de");
    }, [userDetails]);

  return (
    <>
        <NavBar user={user} getUser={getUser} language={language} setLanguage={setLanguage}/>
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Welcome language={language}/>}/>
            <Route element={<ProtectedRoute user={user}/>}>
                <Route path="/scanners" element={<Scanners language={language} allActiveScanner={allActiveScanner} allActiveCustomer={allActiveCustomer} allActiveServicePartner={allActiveServicePartner} allArchivedCustomer={allArchivedCustomer} allArchivedServicePartner={allArchivedServicePartner}/>} />
                <Route path="/scanners/archive" element={<ArchiveScanners language={language} allActiveCustomer={allActiveCustomer} allActiveServicePartner={allActiveServicePartner} allArchivedScanner={allArchivedScanner} allArchivedCustomer={allArchivedCustomer} allArchivedServicePartner={allArchivedServicePartner} />} />
                <Route path="/scanners/add" element={<AddNewScanner language={language} handleNewScannerSubmit={handleNewScannerSubmit} allActiveCustomer={allActiveCustomer} allActiveServicePartner={allActiveServicePartner} />} />
                <Route path="/scanners/:id" element={<ScannerDetails language={language} allActiveCustomer={allActiveCustomer} allActiveServicePartner={allActiveServicePartner} allArchivedCustomer={allArchivedCustomer} allArchivedServicePartner={allArchivedServicePartner}/>} />
                <Route path="/customers" element={<Customers language={language} allActiveCustomer={allActiveCustomer} />} />
                <Route path="/customers/archive" element={<ArchiveCustomers language={language} allActiveScanner={allActiveScanner} allActiveServicePartner={allActiveServicePartner} allArchivedScanner={allArchivedScanner} allArchivedCustomer={allArchivedCustomer} allArchivedServicePartner={allArchivedServicePartner}/>} />
                <Route path="/customers/add" element={<AddNewCustomer language={language} handleNewCustomerSubmit={handleNewCustomerSubmit}/>} />
                <Route path="/customers/:id" element={<CustomerDetails language={language} allActiveScanner={allActiveScanner} allActiveServicePartner={allActiveServicePartner} allArchivedScanner={allArchivedScanner} allArchivedServicePartner={allArchivedServicePartner} />} />
                <Route path="/service-partners" element={<ServicePartners language={language} allActiveServicePartner={allActiveServicePartner}/>} />
                <Route path="/service-partners/archive" element={<ArchiveServicePartners language={language} allActiveScanner={allActiveScanner} allActiveCustomer={allActiveCustomer} allArchivedScanner={allArchivedScanner} allArchivedCustomer={allArchivedCustomer} allArchivedServicePartner={allArchivedServicePartner}/>} />
                <Route path="/service-partners/add" element={<AddNewServicePartner language={language} handleNewServicePartnerSubmit={handleNewServicePartnerSubmit} />} />
                <Route path="/service-partners/:id" element={<ServicePartnerDetails language={language} allActiveScanner={allActiveScanner} allActiveCustomer={allActiveCustomer} allArchivedScanner={allArchivedScanner} allArchivedCustomer={allArchivedCustomer} handleServicePartnerDelete={handleServicePartnerDelete} />} />
                <Route path="/profile/*" element={<Profile language={language} user={user} userDetails={userDetails} setLanguage={setLanguage}/>} />
            </Route>
        </Routes>
        <Footer language={language}/>
    </>
  )
}