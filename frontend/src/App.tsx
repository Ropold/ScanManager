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
import Scanner from "./components/Scanner.tsx";
import Customer from "./components/Customer.tsx";
import ServicePartner from "./components/ServicePartner.tsx";
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
                <Route path="/scanner" element={<Scanner language={language} allScanner={allScanner} allCustomer={allCustomer} allServicePartner={allServicePartner} />} />
                <Route path="/scanner/:id" element={<ScannerDetails language={language} />} />
                <Route path="/customer" element={<Customer language={language} allCustomer={allCustomer}/>} />
                <Route path="/customer/:id" element={<CustomerDetails language={language} />} />
                <Route path="/service-partner" element={<ServicePartner language={language} allServicePartner={allServicePartner}/>} />
                <Route path="/service-partner/:id" element={<ServicePartnerDetails language={language} />} />
                <Route path="/profile/*" element={<Profile user={user} userDetails={userDetails} language={language} setLanguage={setLanguage}/>} />
            </Route>
        </Routes>
        <Footer language={language}/>
    </>
  )
}