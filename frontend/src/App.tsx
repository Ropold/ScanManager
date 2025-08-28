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
    fetchAllServicePartner
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

    const [allScanner, setAllScanner] = useState<ScannerModel[]>([]);
    const [allCustomer, setAllCustomer]= useState<CustomerModel[]>([]);
    const [allServicePartner, setAllServicePartner] = useState<ServicePartnerModel[]>([]);

    function getAllCustomer() {
        fetchAllCustomer(setAllCustomer);
    }

    function getAllServicePartner() {
        fetchAllServicePartner(setAllServicePartner);
    }
    function getAllScanner() {
        fetchAllScanner(setAllScanner);
    }

    function getUser() {
        fetchUser(setUser);
    }

    function getUserDetails() {
        fetchUserDetails(setUserDetails);
    }

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if(user !== "anonymousUser"){
            getUserDetails();
            getAllScanner();
            getAllCustomer();
            getAllServicePartner();
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
                <Route path="/scanners" element={<Scanners language={language} allScanner={allScanner} allCustomer={allCustomer} allServicePartner={allServicePartner} />} />
                <Route path="/scanners/:id" element={<ScannerDetails language={language} />} />
                <Route path="/scanners/add" element={<AddNewScanner />} />
                <Route path="/scanners/archive" element={<ArchiveScanners />} />
                <Route path="/customers" element={<Customers language={language} allCustomer={allCustomer}/>} />
                <Route path="/customers/:id" element={<CustomerDetails language={language} />} />
                <Route path="/customers/add" element={<AddNewCustomer />} />
                <Route path="/customers/archive" element={<ArchiveCustomers />} />
                <Route path="/service-partners" element={<ServicePartners language={language} allServicePartner={allServicePartner}/>} />
                <Route path="/service-partners/:id" element={<ServicePartnerDetails language={language} />} />
                <Route path="/service-partners/add" element={<AddNewServicePartner/>} />
                <Route path="/service-partners/archive" element={<ArchiveServicePartners/>} />
                <Route path="/profile/*" element={<Profile user={user} userDetails={userDetails} language={language} setLanguage={setLanguage}/>} />
            </Route>
        </Routes>
        <Footer language={language}/>
    </>
  )
}