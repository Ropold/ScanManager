
import './App.css'
import {useState} from "react";
import Welcome from "./components/Welcome.tsx";
import NotFound from "./components/NotFound.tsx";
import {Route, Routes} from "react-router-dom";
import Footer from "./components/Footer.tsx";


export default function App() {

    const [language, setLanguage] = useState<string>("de");


  return (
    <>
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Welcome language={language}/>}/>
        </Routes>
        <Footer/>
    </>
  )
}