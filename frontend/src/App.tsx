
import './App.css'
import {useEffect, useState} from "react";
import Welcome from "./components/Welcome.tsx";
import NotFound from "./components/NotFound.tsx";
import {Route, Routes} from "react-router-dom";
import Footer from "./components/Footer.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Profile from "./components/Profile.tsx";
import Navbar from "./components/Navbar.tsx";
import { getUser as fetchUser } from "./App-Functions.ts"


export default function App() {
    const [user, setUser] = useState<string>("anonymousUser");

    const [language, setLanguage] = useState<string>("de");


    function getUser() {
        fetchUser(setUser);
    }

    useEffect(() => {
        getUser();
    }, []);

  return (
    <>
        <Navbar user={user} getUser={getUser} language={language} setLanguage={setLanguage}/>
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Welcome language={language}/>}/>
            <Route element={<ProtectedRoute user={user}/>}>
                <Route path="/profile/*" element={<Profile user={user}/>} />
            </Route>
        </Routes>
        <Footer language={language}/>
    </>
  )
}