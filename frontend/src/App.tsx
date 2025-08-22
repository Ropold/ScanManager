
import './App.css'
import {useEffect, useState} from "react";
import Welcome from "./components/Welcome.tsx";
import NotFound from "./components/NotFound.tsx";
import {Route, Routes} from "react-router-dom";
import Footer from "./components/Footer.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Profile from "./components/Profile.tsx";
import Navbar from "./components/Navbar.tsx";
import { getUser as fetchUser, getUserDetails as fetchUserDetails } from "./App-Functions.ts";
import {DefaultUser, type UserModel} from "./components/model/UserModel.ts";
import Scanner from "./components/Scanner.tsx";
import Customer from "./components/Customer.tsx";
import ServicePartner from "./components/ServicePartner.tsx";


export default function App() {
    const [user, setUser] = useState<string>("anonymousUser");
    const [userDetails, setUserDetails] = useState<UserModel | null>(DefaultUser);

    const [language, setLanguage] = useState<string>("de");


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
        }
    }, [user]);

  return (
    <>
        <Navbar user={user} getUser={getUser} language={language} setLanguage={setLanguage}/>
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Welcome language={language}/>}/>
            <Route element={<ProtectedRoute user={user}/>}>
                <Route path="/scanner/*" element={<Scanner />} />
                <Route path="/customer/*" element={<Customer />} />
                <Route path="/service-partner/*" element={<ServicePartner />} />
                <Route path="/profile/*" element={<Profile user={user} userDetails={userDetails} language={language} setLanguage={setLanguage}/>} />
            </Route>
        </Routes>
        <Footer language={language}/>
    </>
  )
}